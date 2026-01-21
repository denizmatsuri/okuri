import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Megaphone, X } from "lucide-react";

import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { toast } from "sonner";
import { useSession } from "@/store/session";
import { useFamilyById } from "@/hooks/queries/use-family-data";
import { useCurrentFamilyId } from "@/store/family";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import { compressImageIfNeeded } from "@/lib/image";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";

export default function PostEditorModal() {
  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();
  const { data: family } = useFamilyById(currentFamilyId!);
  const { data: profile } = useUserProfileData(session?.user.id);

  const postEditorModal = usePostEditorModal();
  const isEditMode = postEditorModal.type === "EDIT";

  // 폼 상태
  const [content, setContent] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // 이미지 상태 (수정 모드용)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  // 이미지 상태 (공통 - 새 이미지)
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // 폼 초기화 함수
  const resetForm = () => {
    setContent("");
    setIsNotice(false);
    setExistingImageUrls([]);
    setDeletedImageUrls([]);
    setNewImages([]);
    setNewImagePreviews([]);
  };

  // 포스트 생성 훅
  const { mutate: createPost, isPending: isCreatingPostPending } =
    useCreatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
        resetForm();
      },
      onError: () => {
        toast.error("게시글 작성에 실패했습니다", { position: "top-center" });
      },
    });

  // 포스트 수정 훅
  const { mutate: updatePost, isPending: isUpdatingPostPending } =
    useUpdatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
        resetForm();
        toast.success("게시글이 수정되었습니다", { position: "top-center" });
      },
      onError: () => {
        toast.error("게시글 수정에 실패했습니다");
      },
    });

  // 모달이 열릴 때
  useEffect(() => {
    if (isEditMode && postEditorModal.postData) {
      const { content, imageUrls, isNotice } = postEditorModal.postData!;
      setContent(content);
      setExistingImageUrls(imageUrls ?? []);
      setNewImages([]);
      setNewImagePreviews([]);
      setDeletedImageUrls([]);
      setIsNotice(isNotice);
    } else {
      resetForm();
    }
  }, [isEditMode, postEditorModal.postData, postEditorModal.isOpen]);

  // 이미지 선택 핸들러
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 4장 제한 (기존 + 새 이미지 합산)
    const currentTotal = existingImageUrls.length + newImages.length;
    const remainingSlots = 4 - currentTotal;
    const filesToProcess = files.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    try {
      setIsCompressing(true);

      const compressedFiles = await Promise.all(
        filesToProcess.map((file) => compressImageIfNeeded(file, "post")),
      );

      setNewImages((prev) => [...prev, ...compressedFiles]);

      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setNewImagePreviews((prev) => [...prev, ...newPreviewUrls]);
    } catch (error) {
      toast.error("이미지 처리에 실패했습니다.", { position: "top-center" });
    } finally {
      setIsCompressing(false);
    }
  };

  // 기존 이미지 삭제 (URL)
  const handleRemoveExistingImage = (index: number) => {
    const urlToDelete = existingImageUrls[index];
    setDeletedImageUrls((prev) => [...prev, urlToDelete]);
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 새 이미지 삭제 (File)
  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentFamilyId || !session?.user?.id) return;

    if (isEditMode) {
      // 수정 모드
      updatePost({
        postId: postEditorModal.postData!.postId,
        familyId: currentFamilyId,
        userId: session.user.id,
        content: content.trim(),
        isNotice,
        existingImageUrls,
        deletedImageUrls,
        newImages,
      });
    } else {
      // 생성 모드
      createPost({
        familyId: currentFamilyId,
        userId: session.user.id,
        content: content.trim(),
        images: newImages,
        isNotice,
      });
    }
  };

  // 전체 이미지 개수
  const totalImageCount = existingImageUrls.length + newImages.length;
  const isValid = content.trim().length > 0;
  const isPending = isCreatingPostPending || isUpdatingPostPending;

  return (
    <Dialog
      open={postEditorModal.isOpen}
      onOpenChange={postEditorModal.actions.close}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "게시글 수정" : "새 게시글 작성"}
          </DialogTitle>
          {family && (
            <p className="text-muted-foreground text-sm">{family.name}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          {/* 작성 영역 */}
          <div className="flex gap-3">
            <img
              src={profile?.avatar_url ?? defaultAvatar}
              alt="내 프로필"
              className="h-10 w-10 shrink-0 rounded-full border object-cover"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="가족에게 공유하고 싶은 이야기를 적어보세요"
              className="focus-visible:border-input min-h-[120px] resize-none focus-visible:ring-0"
              maxLength={1000}
            />
          </div>

          {/* 이미지 미리보기 */}
          {(existingImageUrls.length > 0 || newImagePreviews.length > 0) && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {/* 기존 이미지 */}
              {existingImageUrls.map((url, index) => (
                <div key={`existing-${index}`} className="relative shrink-0">
                  <img
                    src={url}
                    alt={`기존 이미지 ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* 새 이미지 */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative shrink-0">
                  <img
                    src={preview}
                    alt={`새 이미지 ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 액션 버튼 영역 */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              {/* 이미지 첨부 버튼 */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={totalImageCount >= 4 || isCompressing}
                />
                <div className="text-muted-foreground hover:bg-muted flex items-center gap-1 rounded-md px-3 py-2 text-sm">
                  {isCompressing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" />
                      <span>{`${totalImageCount}/4`}</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {/* 공지 안내 문구 */}
              {isNotice && (
                <span className="text-muted-foreground animate-in fade-in slide-in-from-right-2 flex items-center gap-1.5 text-sm">
                  상단에 고정되어 게시돼요
                </span>
              )}

              {/* 공지 버튼 */}
              <button
                type="button"
                onClick={() => setIsNotice(!isNotice)}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors ${
                  isNotice
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Megaphone className="h-5 w-5" />
              </button>
              <Button type="submit" disabled={!isValid || isPending}>
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isEditMode ? (
                  "수정"
                ) : (
                  "게시하기"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
