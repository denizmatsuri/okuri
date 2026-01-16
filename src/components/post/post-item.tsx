import defaultAvatar from "@/assets/default-avatar.jpg";
import { formatRelativeTime } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router";
import type { Post } from "@/types";

export default function PostItem({ post }: { post: Post }) {
  if (!post) return null;

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
