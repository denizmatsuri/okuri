import { useState } from "react";
import PostItem from "@/components/post/post-item";
import FamilyTabs from "@/components/post/family-tabs";
import CategoryFilter from "@/components/post/category-filter";
import type { PostCategory } from "@/types";
import { useCurrentFamilyId, useSetCurrentFamilyId } from "@/store/family";
// import { usePostsData } from "@/hooks/queries/use-post-data";
import { useMyFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import { extractFamilyMemberships } from "@/lib/utils";
import { useInfinitePosts } from "@/hooks/queries/use-infinite-posts";
import { useInView } from "react-intersection-observer";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "@/store/session";

export default function PostFeed() {
  const session = useSession();
  const userId = session!.user.id;
  const currentFamilyId = useCurrentFamilyId();
  const setCurrentFamilyId = useSetCurrentFamilyId();

  const [category, setCategory] = useState<PostCategory>("all");

  // 가족 타입 가져오기
  const { data: familiesWithMembers = [] } = useMyFamiliesWithMembers();

  // FamilyTabs에서 필요한 형태로 변환
  const familyTabs = extractFamilyMemberships(familiesWithMembers);

  // const { data: posts = [] } = usePostsData(currentFamilyId!);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts(userId!, currentFamilyId!, category);

  // ID 배열 평탄화
  const postIds = data?.pages.flatMap((page) => page.ids) ?? [];

  // 무한스크롤 트리거
  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) flex w-full flex-1 flex-col border-x md:m-0">
      {/* 가족 탭 */}
      <FamilyTabs
        families={familyTabs}
        currentFamilyId={currentFamilyId!}
        onFamilyChange={setCurrentFamilyId}
      />

      {/* 카테고리 필터 */}
      <CategoryFilter
        category={category}
        onCategoryChange={setCategory}
        // noticeCount={noticeCount}
      />

      {/* 게시글 목록 */}
      <div className="flex flex-1 flex-col">
        {isLoading ? (
          // FIXME: 스켈레톤 추가
          // <PostListSkeleton />
          <LoaderCircleIcon className="animate-spin" />
        ) : postIds.length === 0 ? (
          <div className="...">아직 게시글이 없어요</div>
        ) : (
          <>
            {postIds.map((id) => (
              <PostItem key={id} postId={id} type="FEED" />
            ))}

            {/* 무한스크롤 트리거 */}
            <div ref={loadMoreRef} className="h-10">
              {isFetchingNextPage && (
                <LoaderCircleIcon className="animate-spin" />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
