import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Megaphone, X } from "lucide-react";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFamiliesWithMembers } from "@/hooks/queries/use-families-with-members";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";
import { useSession } from "@/store/session";
import { useCurrentFamilyId } from "@/store/family";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { compressImageIfNeeded } from "@/lib/image";

const maxSlots = 10;

export default function PostEditorModal() {
  const [content, setContent] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();
  const postEditorModal = usePostEditorModal();

  const { data: familiesWithMembers } = useFamiliesWithMembers(
    session?.user.id,
  );

  // 현재 가족 정보 및 내 멤버십 추출
  const currentFamily = familiesWithMembers?.find(
    (f) => f.id === currentFamilyId,
  );
  const myMembership = currentFamily?.members.find(
    (m) => m.user_id === session?.user.id,
  );

  const isEditMode = postEditorModal.type === "EDIT";

  const resetForm = () => {
    setContent("");
    setIsNotice(false);
    setExistingImageUrls([]);
    setDeletedImageUrls([]);
    setNewImages([]);
    setNewImagePreviews([]);
  };

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

  const { mutate: updatePost, isPending: isUpdatingPostPending } =
    useUpdatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
        resetForm();
        toast.success("게시글이 수정되었습니다", { position: "top-center" });
      },
      onError: () => {
        toast.error("게시글 수정에 실패했습니다", { position: "top-center" });
      },
    });

  // 모달이 열릴 때 폼 상태 초기화
  useEffect(() => {
    if (isEditMode && postEditorModal.postData) {
      const { content, imageUrls, isNotice } = postEditorModal.postData;
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 maxSlots장 제한 (기존 + 새 이미지 합산)
    const currentTotal = existingImageUrls.length + newImages.length;
    const remainingSlots = maxSlots - currentTotal;
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

  const handleRemoveExistingImage = (index: number) => {
    const urlToDelete = existingImageUrls[index];
    setDeletedImageUrls((prev) => [...prev, urlToDelete]);
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !content.trim() ||
      !currentFamilyId ||
      !session?.user?.id ||
      !myMembership
    )
      return;

    if (isEditMode) {
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
      createPost({
        familyId: currentFamilyId,
        userId: session.user.id,
        familyMemberId: myMembership.id,
        content: content.trim(),
        images: newImages,
        isNotice,
      });
    }
  };

  const totalImageCount = existingImageUrls.length + newImages.length;
  const isValid = content.trim().length > 0;
  const isPending = isCreatingPostPending || isUpdatingPostPending;

  return (
    <Dialog
      open={postEditorModal.isOpen}
      onOpenChange={postEditorModal.actions.close}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "게시글 수정" : "새 게시글 작성"}
          </DialogTitle>
          {currentFamily && (
            <p className="text-muted-foreground text-sm">
              {currentFamily.name}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          {/* 작성 영역 */}
          <div className="flex gap-3">
            <img
              src={
                myMembership?.avatar_url ??
                myMembership?.user?.avatar_url ??
                defaultAvatar
              }
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
              {existingImageUrls.map((url, index) => (
                <div key={url} className="relative shrink-0">
                  <img
                    src={url}
                    alt={`기존 이미지 ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {newImagePreviews.map((preview, index) => (
                <div key={preview} className="relative shrink-0">
                  <img
                    src={preview}
                    alt={`새 이미지 ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
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
                  disabled={totalImageCount >= maxSlots || isCompressing}
                />
                <div className="text-muted-foreground hover:bg-muted flex items-center gap-1 rounded-md px-3 py-2 text-sm">
                  {isCompressing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" />
                      <span>{`${totalImageCount}/${maxSlots}`}</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {/* 공지 안내 문구 */}
              {isNotice && (
                <span className="text-muted-foreground animate-in fade-in slide-in-from-right-2 flex items-center gap-1.5 text-sm">
                  {/* 상단에 고정되어 게시돼요 */}
                  공지사항으로 게시돼요
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
