import PostItem from "@/components/post/post-item";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";
import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;
  useScrollToTop();

  const navigate = useNavigate();
  if (!postId) return <Navigate to="/" replace={true} />;

  return (
    <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 flex-col md:m-0 md:bg-transparent">
      {/* 헤더 - 뒤로가기 */}
      <div className="flex h-15 items-center gap-2 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">게시글</span>
      </div>

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
