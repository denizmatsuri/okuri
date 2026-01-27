import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { PenLine } from "lucide-react";
import PostItem from "@/components/post/post-item";
import FamilyTabs from "@/components/post/family-tabs";
import CategoryFilter from "@/components/post/category-filter";
import Loader from "@/components/loader";
import Fallback from "@/components/fallback";
import { useMyFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import { useInfinitePosts } from "@/hooks/queries/use-infinite-posts";
import { useSession } from "@/store/session";
import { useCurrentFamilyId, useSetCurrentFamilyId } from "@/store/family";
import { useOpenCreatePostEditorModal } from "@/store/post-editor-modal";
import { extractFamilyMemberships } from "@/lib/utils";
import type { PostCategory } from "@/types";

export default function PostFeed() {
  const [category, setCategory] = useState<PostCategory>("all");

  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();
  const setCurrentFamilyId = useSetCurrentFamilyId();
  const openCreatePostEditorModal = useOpenCreatePostEditorModal();

  const { data: familiesWithMembers = [], error: familiesError } =
    useMyFamiliesWithMembers();
  const {
    data,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePosts(session!.user.id, currentFamilyId!, category);

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (familiesError) {
    return <Fallback message="가족 정보를 불러오는데 실패했습니다." />;
  }
  if (postsError) {
    return <Fallback message="게시글을 불러오는데 실패했습니다." />;
  }

  const familyTabs = extractFamilyMemberships(familiesWithMembers);
  const postIds = data?.pages.flatMap((page) => page.ids) ?? [];

  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) flex w-full flex-1 flex-col border-x md:m-0">
      {/* 가족 탭 */}
      <FamilyTabs
        families={familyTabs}
        currentFamilyId={currentFamilyId!}
        onFamilyChange={setCurrentFamilyId}
      />

      {/* 카테고리 필터 */}
      <CategoryFilter category={category} onCategoryChange={setCategory} />

      {/* 게시글 목록 */}
      <div className="flex flex-1 flex-col">
        {isLoading ? (
          <div className="py-10">
            <Loader />
          </div>
        ) : postIds.length === 0 ? (
          <button
            onClick={openCreatePostEditorModal}
            className="bg-muted/50 hover:bg-muted mx-4 mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-8 transition-colors"
          >
            <PenLine className="text-muted-foreground h-6 w-6" />
            <p className="text-muted-foreground text-sm">
              소소한 일상을 공유해보세요
            </p>
          </button>
        ) : (
          <>
            {postIds.map((id) => (
              <PostItem key={id} postId={id} type="FEED" />
            ))}

            {/* 무한스크롤 트리거 */}
            <div ref={loadMoreRef} className="h-10">
              {isFetchingNextPage && <Loader />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
