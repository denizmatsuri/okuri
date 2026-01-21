import useTogglePostLike from "@/hooks/mutations/post/use-toggle-post-like";
import { useSession } from "@/store/session";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

export default function LikePostButton({
  id,
  likeCount,
  isLiked,
}: {
  id: number;
  likeCount: number;
  isLiked: boolean;
}) {
  // console.log("like-post-button, isLiked", isLiked);
  const session = useSession();

  const { mutate: togglePostLike } = useTogglePostLike({
    onError: (_) => {
      toast.error("좋아요 토글에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const handleTogglePostLike = () => {
    togglePostLike({
      postId: id,
      userId: session!.user.id, // 유저 세션이 있어야 이 컴포넌트가 보이기에 ! 사용
    });
  };

  return (
    <div
      onClick={handleTogglePostLike}
      className="hover:bg-muted relative z-10 flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm"
    >
      <HeartIcon
        className={`h-4 w-4 ${isLiked && "fill-foreground border-foreground"}`}
      />
      <span>{likeCount}</span>
    </div>
  );
}
