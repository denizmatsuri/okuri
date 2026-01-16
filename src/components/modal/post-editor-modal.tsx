import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostForm from "../post/post-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/store/session";
import { useFamilyById } from "@/hooks/queries/use-family-data";
import { useCurrentFamilyId } from "@/store/family";
import { usePostEditorModal } from "@/store/post-editor-modal";

export default function PostEditorModal() {
  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();
  const { data: family } = useFamilyById(currentFamilyId!);

  const postEditorModal = usePostEditorModal();

  const { mutate: createPost } = useCreatePost({
    onSuccess: () => {
      postEditorModal.actions.close();
    },
    onError: () => {
      toast.error("게시글 작성에 실패했습니다", { position: "top-center" });
    },
  });

  const handlePostSubmit = ({
    content,
    images,
    isNotice,
  }: {
    content: string;
    images: File[];
    isNotice?: boolean;
  }) => {
    if (!currentFamilyId || !session?.user?.id) return;

    createPost({
      familyId: currentFamilyId,
      userId: session.user.id,
      content,
      images,
      isNotice,
    });
  };

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
        <PostForm
          onSubmit={handlePostSubmit}
          onCancel={postEditorModal.actions.close}
        />
      </DialogContent>
    </Dialog>
  );
}
