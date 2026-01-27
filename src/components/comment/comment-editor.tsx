import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/mutations/comment/use-create-comment";
import useUpdateComment from "@/hooks/mutations/comment/use-update-comment";
import { useCurrentFamilyId } from "@/store/family";

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
  const [content, setContent] = useState(
    props.type === "EDIT" ? props.initialContent : "",
  );

  const currentFamilyId = useCurrentFamilyId();

  const { mutate: createComment, isPending: isCreatingPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
        if (props.type === "REPLY") props.onClose();
      },
      onError: () => {
        toast.error("댓글 작성에 실패했습니다", { position: "top-center" });
      },
    });

  const { mutate: updateComment, isPending: isUpdatingPending } =
    useUpdateComment({
      onSuccess: () => {
        if (props.type === "EDIT") {
          props.onClose();
        }
      },
      onError: () => {
        toast.error("댓글 수정에 실패했습니다", { position: "top-center" });
      },
    });

  const isPending = isCreatingPending || isUpdatingPending;

  const handleSubmitClick = () => {
    if (!content.trim()) {
      toast.error("댓글을 입력해주세요", { position: "top-center" });
      return;
    }

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

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="댓글을 입력하세요"
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
          {props.type === "EDIT" ? "수정" : "작성"}
        </Button>
      </div>
    </div>
  );
}
