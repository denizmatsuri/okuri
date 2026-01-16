import { useState } from "react";
import PostItem from "@/components/post/post-item";
import FamilyTabs from "@/components/post/family-tabs";
import CategoryFilter from "@/components/post/category-filter";
import type { PostCategory } from "@/types";
import { useCurrentFamilyId, useSetCurrentFamilyId } from "@/store/family";
import { usePostsData } from "@/hooks/queries/use-post-data";
import { useMyFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import { extractFamilyMemberships } from "@/lib/utils";

export default function PostFeed() {
  const currentFamilyId = useCurrentFamilyId();
  const setCurrentFamilyId = useSetCurrentFamilyId();

  const [category, setCategory] = useState<PostCategory>("all");

  // 가족 타입 가져오기
  const { data: familiesWithMembers = [] } = useMyFamiliesWithMembers();

  // FamilyTabs에서 필요한 형태로 변환
  const familyTabs = extractFamilyMemberships(familiesWithMembers);

  const { data: posts = [] } = usePostsData(currentFamilyId!);

  // 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    if (category === "all") return true;
    if (category === "notice") return post.is_notice;
    if (category === "general") return !post.is_notice;
    return true;
  });

  const noticeCount = posts.filter((p) => p.is_notice).length;

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
        noticeCount={noticeCount}
      />

      {/* 게시글 목록 */}
      <div className="flex flex-1 flex-col">
        {filteredPosts.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 items-center justify-center">
            아직 게시글이 없어요
          </div>
        ) : (
          filteredPosts.map((post) => <PostItem key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}
