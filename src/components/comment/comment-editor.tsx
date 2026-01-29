import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/mutations/comment/use-create-comment";
import useUpdateComment from "@/hooks/mutations/comment/use-update-comment";
import { useFamiliesWithMembers } from "@/hooks/queries/use-families-with-members";
import { useCurrentFamilyId } from "@/store/family";
import { useSession } from "@/store/session";

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

  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();

  const { data: familiesWithMembers } = useFamiliesWithMembers(session?.user.id);

  // 현재 가족에서 내 멤버십 추출
  const currentFamily = familiesWithMembers?.find(
    (f) => f.id === currentFamilyId,
  );
  const myMembership = currentFamily?.members.find(
    (m) => m.user_id === session?.user.id,
  );

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
      if (!myMembership) return;
      createComment({
        postId: props.postId,
        familyMemberId: myMembership.id,
        content,
      });
    } else if (props.type === "EDIT") {
      updateComment({
        id: props.commentId,
        content,
      });
    } else if (props.type === "REPLY") {
      if (!myMembership) return;
      createComment({
        postId: props.postId,
        familyMemberId: myMembership.id,
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
