import PostItem from "@/components/post/post-item";
import { Button } from "@/components/ui/button";
import { usePostById } from "@/hooks/queries/use-post-by-id-data";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function PostDetailPage() {
  const { postId } = useParams();

  const { data: post } = usePostById(Number(postId));

  const navigate = useNavigate();

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
      {post && <PostItem postId={post.id} />}
    </div>
  );
}
