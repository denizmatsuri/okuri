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
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isNotice, setIsNotice] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // 폼 초기화 함수
  const resetForm = () => {
    setContent("");
    setImages([]);
    setPreviews([]);
    setIsNotice(false);
  };

  // 포스트 생성 훅
  const { mutate: createPost, isPending: isCreatingPostPending } =
    useCreatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
        // 폼 초기화
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

  // // 모달이 열릴 때 폼 초기화
  // useEffect(() => {
  //   if (postEditorModal.isOpen) {
  //     resetForm();
  //   }
  // }, [postEditorModal.isOpen]);

  // 모달이 열릴 때
  useEffect(() => {
    if (isEditMode && postEditorModal.postData) {
      // EDIT 모드시
      const { content, imageUrls, isNotice } = postEditorModal.postData!;
      setContent(content);
      // setImages(imageUrls?.map((url) => new File([], url)) ?? []);
      setPreviews(imageUrls ?? []);
      setIsNotice(isNotice);
    } else {
      // CREATE 모드시 폼 초기화
      resetForm();
    }
  }, [isEditMode, postEditorModal.postData, postEditorModal.isOpen]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 4장 제한 (기존 이미지 개수 고려)
    const remainingSlots = 4 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    try {
      setIsCompressing(true);

      // 모든 이미지 압축 처리
      const compressedFiles = await Promise.all(
        filesToProcess.map((file) => compressImageIfNeeded(file, "post")),
      );

      const newImages = [...images, ...compressedFiles];
      setImages(newImages);

      // 미리보기 URL 생성
      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews([...previews, ...newPreviewUrls]);
    } catch (error) {
      toast.error("이미지 처리에 실패했습니다.", { position: "top-center" });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // 이전 preview URL 해제
    URL.revokeObjectURL(previews[index]);

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentFamilyId || !session?.user?.id) return;

    if (isEditMode) {
      // 수정 모드
      updatePost({
        id: postEditorModal.postData!.postId,
        content: content.trim(),
        is_notice: isNotice,
        // TODO: 이미지 업데이트 로직 필요 시 추가
      });
    } else {
      // 생성 모드
      createPost({
        familyId: currentFamilyId,
        userId: session.user.id,
        content: content.trim(),
        images,
        isNotice,
      });
    }
  };

  const isValid = content.trim().length > 0;

  const isPending = isCreatingPostPending || isUpdatingPostPending;

  return (
    <Dialog
      open={postEditorModal.isOpen}
      onOpenChange={postEditorModal.actions.close}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>새 게시글 작성</DialogTitle>
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
          {previews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative shrink-0">
                  <img
                    src={preview}
                    alt={`첨부 이미지 ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
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
                  disabled={images.length >= 4 || isCompressing}
                />
                <div className="text-muted-foreground hover:bg-muted flex items-center gap-1 rounded-md px-3 py-2 text-sm">
                  {isCompressing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" />
                      <span>{`${images.length}/4`}</span>
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
