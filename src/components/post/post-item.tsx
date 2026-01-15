import { MoreHorizontal } from "lucide-react";

import defaultAvatar from "@/assets/default-avatar.jpg";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { mockPosts, type MockPost } from "@/lib/mock-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router";

// type PostItemProps = {
//   post: MockPost;
//   isMine?: boolean;
// };

export default function PostItem({ postId }: { postId: string }) {
  // const { data: post } = usePost(postId);

  // mock data
  const post = mockPosts.find((post: MockPost) => post.id === postId);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <article className="relative flex flex-col gap-3 border-b p-4">
      {/* 작성자 정보 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar || defaultAvatar}
            alt="프로필"
            className="h-12 w-12 rounded-full border object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{post.authorName}</span>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>{post.authorRole}</span>
              <span>·</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* {isMine && (
          <Button variant="ghost" size="icon" className="relative z-10 h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )} */}
      </div>

      {/* 게시글 내용 - 링크 + 전체 영역 커버 */}
      <Link
        to={`/post/${post.id}`}
        className="whitespace-pre-wrap after:absolute after:inset-0"
      >
        {post.content}
      </Link>

      {/* 이미지 캐러셀 - 링크 위에 올림 */}
      <Carousel className="relative z-10">
        <CarouselContent>
          {post.imageUrls?.map((url, index) => (
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
    </article>
  );
}
