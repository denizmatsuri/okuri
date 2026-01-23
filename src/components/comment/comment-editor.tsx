import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/mutations/comment/use-create-comment";
import useUpdateComment from "@/hooks/mutations/comment/use-update-comment";
import { useCurrentFamilyId } from "@/store/family";
import { useState } from "react";
import { toast } from "sonner";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  onClose: () => void;
};

type Props = CreateMode | EditMode | ReplyMode;

export default function CommentEditor(props: Props) {
  const currentFamilyId = useCurrentFamilyId();

  const [content, setContent] = useState(
    props.type === "EDIT" ? props.initialContent : "",
  );

  // 댓글 생성 훅
  const { mutate: createComment, isPending: isCreatingPending } =
    useCreateComment({
      onSuccess: () => {
        // toast.success("댓글이 작성되었습니다");
        setContent("");
        if (props.type === "REPLY") props.onClose();
      },
      onError: (error) => {
        console.error(error);
        toast.error("댓글 작성에 실패했습니다");
      },
    });

  // 댓글 수정 훅
  const { mutate: updateComment, isPending: isUpdatingPending } =
    useUpdateComment({
      onSuccess: () => {
        // toast.success("댓글이 수정되었습니다");
        (props as EditMode).onClose();
      },
      onError: () => {
        toast.error("댓글 수정에 실패했습니다");
      },
    });

  const handleSubmitClick = () => {
    // 댓글 생성 요청
    if (props.type === "CREATE") {
      createComment({
        postId: props.postId,
        familyId: currentFamilyId!,
        content,
      });
    } else if (props.type === "EDIT") {
      updateComment({
        id: props.commentId,
        content,
      });
    } else if (props.type === "REPLY") {
      createComment({
        postId: props.postId,
        familyId: currentFamilyId!,
        content,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId,
      });
    }
  };

  const isPending = isCreatingPending || isUpdatingPending;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        disabled={isPending}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {(props.type === "EDIT" || props.type === "REPLY") && (
          <Button
            disabled={isPending}
            variant="outline"
            onClick={props.onClose}
          >
            취소
          </Button>
        )}
        <Button disabled={isPending} onClick={handleSubmitClick}>
          작성
        </Button>
      </div>
    </div>
  );
}
