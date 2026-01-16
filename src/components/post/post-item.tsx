import { useState } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";

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
import { Link } from "react-router";
import { useSession } from "@/store/session";
import type { Post } from "@/types";

export default function PostItem({ post }: { post: Post }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const session = useSession();

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
    // TODO: 수정 모달 열기
    console.log("수정:", post.id);
  };

  // 삭제 핸들러
  const handleDelete = () => {
    setIsPopoverOpen(false);
    // TODO: 삭제 확인 다이얼로그 열기
    console.log("삭제:", post.id);
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
    </article>
  );
}
