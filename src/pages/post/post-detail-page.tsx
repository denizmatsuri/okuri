import PostItem from "@/components/post/post-item";
import { Navigate, useParams } from "react-router";
import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { SubHeader } from "@/components/layout/sub-header";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;
  useScrollToTop();

  if (!postId) return <Navigate to="/" replace={true} />;

  return (
    <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 flex-col md:m-0 md:bg-transparent">
      {/* 헤더 */}
      <SubHeader title="게시글" />

      {/* 게시글 + 댓글 섹션 */}
      <div className="md:bg-background flex flex-1 flex-col border-b-0 md:rounded-t-4xl md:border">
        <PostItem postId={Number(postId)} type="DETAIL" />

        {/* 댓글 섹션 */}
        <CommentEditor type="CREATE" postId={Number(postId)} />
        <CommentList postId={Number(postId)} />
      </div>
    </main>
  );
}
