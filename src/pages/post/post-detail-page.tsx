import PostItem from "@/components/post/post-item";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";
import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;

  const navigate = useNavigate();
  if (!postId) return <Navigate to="/" replace={true} />;

  return (
    <div>
      {/* 뒤로가기 버튼 공간 */}
      <div className="flex items-center gap-2 overflow-x-auto border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative z-10 h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <PostItem postId={Number(postId)} type="DETAIL" />

      {/* 댓글 섹션 */}
      <CommentEditor type="CREATE" postId={Number(postId)} />
      <CommentList postId={Number(postId)} />
    </div>
  );
}
