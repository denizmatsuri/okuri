import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.jpg";
import CommentEditor from "./comment-editor";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDeleteComment from "@/hooks/mutations/comment/use-delete-comment";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import { formatRelativeTime } from "@/lib/utils";
import type { NestedComment } from "@/types";

export default function CommentItem(props: NestedComment) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
    setIsPopoverOpen(false);
  };
  const toggleIsReply = () => setIsReply(!isReply);

  const handleDeleteClick = () => {
    setIsPopoverOpen(false);
    openAlertModal({
      title: "댓글 삭제",
      description: "정말 삭제하시겠습니까?",
      onPositive: () => {
        deleteComment({ id: props.id });
      },
    });
  };

  return (
    <div className={`flex flex-col ${isRootComment ? "py-4" : "ml-8 pt-4"}`}>
      <div className="flex items-start gap-3">
        <Link to={`/profile/${props.author_id}`}>
          <img
            className="h-9 w-9 rounded-full object-cover"
            src={
              props.familyMember?.avatar_url ||
              props.familyMember?.user?.avatar_url ||
              defaultAvatar
            }
            alt="프로필"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">
                {props.familyMember?.user?.display_name}
              </div>
              <span className="text-muted-foreground text-sm">
                {formatRelativeTime(props.created_at)}
              </span>
            </div>
            {isMine && (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="-mt-1 -mr-2"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="end">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="h-auto justify-start rounded-2xl py-3"
                      onClick={toggleIsEditing}
                    >
                      <Pencil className="h-4 w-4" />
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive h-auto justify-start rounded-2xl py-3"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {isEditing ? (
            <div className="-mx-4">
              <CommentEditor
                type="EDIT"
                commentId={props.id}
                initialContent={props.content}
                onClose={toggleIsEditing}
              />
            </div>
          ) : (
            <div className="text-sm leading-relaxed">
              {isOverTwoLevels && (
                <span className="text-primary font-semibold">
                  @{props.parentComment?.familyMember?.user?.display_name}&nbsp;
                </span>
              )}
              {props.content}
            </div>
          )}
          <div className="text-muted-foreground flex items-center text-sm">
            <button
              onClick={toggleIsReply}
              className="hover:text-foreground py-1 transition-colors"
            >
              답글
            </button>
          </div>
        </div>
      </div>
      {isReply && (
        <div className="-mx-4 mt-2">
          <CommentEditor
            type="REPLY"
            postId={props.post_id}
            parentCommentId={props.id}
            rootCommentId={props.root_comment_id || props.id}
            onClose={toggleIsReply}
          />
        </div>
      )}
      {props.children.map((child) => (
        <CommentItem key={child.id} {...child} />
      ))}
    </div>
  );
}
