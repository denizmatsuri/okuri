import { useState } from "react";
import { Pencil, Trash2, MoreHorizontal, MessageCircle } from "lucide-react";

import defaultAvatar from "@/assets/default-avatar.jpg";
import { formatRelativeTime } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useSession } from "@/store/session";
import { useOpenEditPostEditorModal } from "@/store/post-editor-modal";
import { usePostById } from "@/hooks/queries/use-post-by-id-data";
import { toast } from "sonner";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import LikePostButton from "@/components/post/like-post-button";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function PostItem({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();
  const { data: post, isLoading: isLoadingPost } = usePostById({
    postId,
    type,
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const openEditPostEditorModal = useOpenEditPostEditorModal();
  const session = useSession();

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다", { position: "top-center" });

      // 삭제 성공시, 현재 페이지가 게시글 상세 페이지인 경우 메인 페이지로 이동
      const pathName = window.location.pathname;
      if (pathName.includes(`/post/${postId}`)) {
        navigate("/", { replace: true });
      }
    },
    onError: () => {
      toast.error("게시글 삭제에 실패했습니다", { position: "top-center" });
    },
  });

  // 로딩 상태 (스켈레톤 또는 null)
  // FIXME: 스켈레톤 추가
  // if (isLoadingPost) return <PostItemSkeleton className="h-20 w-full" />;
  if (!post) return null;

  // 현재 사용자가 작성자인지 확인
  const isMine = session?.user.id === post.author_id;

  // author 정보 추출
  const authorName =
    post.familyMember?.display_name ??
    post.familyMember?.user?.display_name ??
    "알 수 없음";
  const authorRole = post.familyMember?.family_role ?? "";
  const authorAvatar =
    post.familyMember?.avatar_url ??
    post.familyMember?.user?.avatar_url ??
    defaultAvatar;

  // 수정 핸들러
  const handleEdit = () => {
    setIsPopoverOpen(false);
    openEditPostEditorModal({
      postId: post.id,
      content: post.content,
      imageUrls: post.image_urls,
      isNotice: post.is_notice,
    });
  };

  // 삭제 핸들러
  const handleDelete = () => {
    setIsPopoverOpen(false);
    openAlertModal({
      title: "게시글 삭제",
      description: "정말 삭제하시겠습니까?",
      onPositive: () => {
        deletePost(post);
      },
      onNegative: () => {
        console.log("취소");
      },
    });
  };

  return (
    <article className="relative flex flex-col gap-3 border-b p-4">
      {/* 작성자 정보 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar || defaultAvatar}
            alt="프로필"
            className="h-12 w-12 rounded-full border object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{authorName}</span>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>{authorRole}</span>
              <span>·</span>
              <span>{formatRelativeTime(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* 본인 게시물인 경우에만 표시 */}
        {isMine && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative z-10 -mt-1 -mr-2"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive justify-start"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* 게시글 내용 */}
      <Link
        to={`/post/${post.id}`}
        className="whitespace-pre-wrap after:absolute after:inset-0"
      >
        {post.content}
      </Link>

      {/* 이미지 캐러셀 */}
      {post.image_urls && post.image_urls.length > 0 && (
        <Carousel className="relative z-10">
          <CarouselContent>
            {post.image_urls.map((url, index) => (
              <CarouselItem className="basis-3/5" key={index}>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={url}
                    className="h-full max-h-[350px] w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {/* 3. 좋아요, 댓글 버튼 */}
      <div className="relative z-10">
        <div className="flex gap-2">
          {/* 3-1. 좋아요 버튼 */}
          {
            <LikePostButton
              id={postId}
              likeCount={post.like_count}
              isLiked={post.isLiked}
            />
          }

          {/* 3-2. 댓글 버튼 */}
          {type === "FEED" && (
            <Link to={`/post/${post.id}`}>
              <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
                <MessageCircle className="h-4 w-4" />
                <span>댓글 달기</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
