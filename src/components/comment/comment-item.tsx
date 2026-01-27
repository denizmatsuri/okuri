import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.jpg";
import CommentEditor from "./comment-editor";
import useDeleteComment from "@/hooks/mutations/comment/use-delete-comment";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import { formatRelativeTime } from "@/lib/utils";
import type { NestedComment } from "@/types";

export default function CommentItem(props: NestedComment) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const { mutate: deleteComment } = useDeleteComment({
    onError: () => {
      toast.error("댓글 삭제에 실패했습니다.", { position: "top-center" });
    },
  });

  const isMine = session?.user.id === props.author_id;
  const isRootComment = props.parentComment === undefined;
  const isOverTwoLevels = props.parent_comment_id !== props.root_comment_id;

  const toggleIsEditing = () => setIsEditing(!isEditing);
  const toggleIsReply = () => setIsReply(!isReply);

  const handleDeleteClick = () => {
    openAlertModal({
      title: "댓글 삭제",
      description: "정말 삭제하시겠습니까?",
      onPositive: () => {
        deleteComment({ id: props.id });
      },
    });
  };

  return (
    <div
      className={`flex flex-col ${isRootComment ? "border-b py-5" : "ml-6 pt-5"}`}
    >
      <div className="flex items-start gap-4">
        <Link to={`/profile/${props.author_id}`}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={
                props.familyMember?.avatar_url ||
                props.familyMember?.user?.avatar_url ||
                defaultAvatar
              }
              alt="프로필"
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">
            {props.familyMember?.user?.display_name}
          </div>
          {isEditing ? (
            <CommentEditor
              type="EDIT"
              commentId={props.id}
              initialContent={props.content}
              onClose={toggleIsEditing}
            />
          ) : (
            <div>
              {isOverTwoLevels && (
                <span className="font-bold text-blue-500">
                  @{props.parentComment?.familyMember?.user?.display_name}&nbsp;
                </span>
              )}
              {props.content}
            </div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                onClick={toggleIsReply}
                className="cursor-pointer hover:underline"
              >
                댓글
              </div>
              <div className="bg-border h-[13px] w-[2px]"></div>
              <div>{formatRelativeTime(props.created_at)}</div>
            </div>
            <div className="flex items-center gap-2">
              {isMine && (
                <>
                  <div
                    onClick={toggleIsEditing}
                    className="cursor-pointer hover:underline"
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-[2px]"></div>
                  <div
                    onClick={handleDeleteClick}
                    className="cursor-pointer hover:underline"
                  >
                    삭제
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReply && (
        <CommentEditor
          type="REPLY"
          postId={props.post_id}
          parentCommentId={props.id}
          rootCommentId={props.root_comment_id || props.id} // 루트 댓글인 경우 자기 자신의 id를 루트 댓글 id로 설정
          onClose={toggleIsReply}
        />
      )}
      {props.children.map((child) => (
        <CommentItem key={child.id} {...child} />
      ))}
    </div>
  );
}
