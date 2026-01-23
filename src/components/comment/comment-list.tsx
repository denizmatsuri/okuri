import { useCommentsData } from "@/hooks/queries/use-comments-data";
import { Loader } from "lucide-react";
import type { Comment, NestedComment } from "@/types";
import { useCurrentFamilyId } from "@/store/family";
import CommentItem from "./comment-item";

/**
 * 평탄한 댓글 배열을 계층 구조로 변환
 *
 * @param comments - DB에서 가져온 평탄한 댓글 배열
 * @returns 루트 댓글과 대댓글이 중첩된 계층 구조
 *
 * @example
 * // 입력: [댓글1, 대댓글1-1, 댓글2, 대댓글1-2]
 * // 출력: [
 * //   { ...댓글1, children: [대댓글1-1, 대댓글1-2] },
 * //   { ...댓글2, children: [] }
 * // ]
 */
function toNestedComments(comments: Comment[]): NestedComment[] {
  const result: NestedComment[] = [];

  comments.forEach((comment) => {
    // 루트 댓글 처리
    if (!comment.root_comment_id) {
      result.push({ ...comment, children: [] });
    }
    // 대댓글 처리
    else {
      const rootCommentIndex = result.findIndex(
        (item) => item.id === comment.root_comment_id,
      );

      const parentComment = comments.find(
        (item) => item.id === comment.parent_comment_id,
      );

      if (rootCommentIndex === -1) return; // 루트 댓글 미발견 시 스킵
      if (!parentComment) return; // 부모 댓글 부재 시 스킵

      // 해당 루트 댓글의 children에 추가
      result[rootCommentIndex].children.push({
        ...comment,
        children: [],
        parentComment: parentComment,
      });
    }
  });

  return result;
}

export default function CommentList({ postId }: { postId: number }) {
  const currentFamilyId = useCurrentFamilyId();

  const {
    data: comments,
    isPending: isFetchingCommentsPending,
    error: fetchCommentsError,
  } = useCommentsData(postId, currentFamilyId!);

  // if (fetchCommentsError) return <Fallback />;
  if (fetchCommentsError)
    return <div>댓글 목록을 불러오는데 실패했습니다.</div>;
  if (isFetchingCommentsPending) return <Loader />;

  // 계층형 댓글 구조로 변환
  const nestedComments = toNestedComments(comments);

  return (
    <div className="flex flex-col">
      {nestedComments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
