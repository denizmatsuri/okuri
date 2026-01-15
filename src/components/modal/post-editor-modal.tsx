import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostForm from "../post/post-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/store/session";

export default function PostEditorModal({
  isOpen,
  onOpenChange,
  familyId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  familyId: string;
}) {
  const session = useSession();
  const { mutate: createPost } = useCreatePost({
    onSuccess: () => {
      onOpenChange(false);
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
    if (!familyId || !session?.user?.id) return;

    createPost({
      familyId,
      userId: session.user.id,
      content,
      images,
      isNotice,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>새 게시글 작성</DialogTitle>
        </DialogHeader>
        <PostForm
          onSubmit={handlePostSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
