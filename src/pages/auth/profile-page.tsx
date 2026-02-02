import { useSession } from "@/store/session";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Plus, Settings } from "lucide-react";
import Loader from "@/components/loader";
import { useFamiliesWithMembers } from "@/hooks/queries/use-families-with-members";
import type { FamilyMember } from "@/types";
import FamilyMemberProfileModal from "@/components/modal/family-member-profile-modal";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const { data: profile } = useUserProfileData(userId);

  const session = useSession();
  const isMine = userId === session?.user.id;

  // 선택된 가족 멤버 상태 (모달용)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );

  // 페이지 접속시 페이지 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const { data: families = [], isLoading: isLoadingFamilies } =
    useFamiliesWithMembers(userId);

  return (
    <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 flex-col md:m-0 md:bg-transparent">
      {/* 페이지 타이틀 - 데스크탑만 */}
      <div className="hidden h-15 items-center justify-center md:flex">
        <span className="text-lg font-medium">프로필</span>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="md:bg-background flex flex-1 flex-col gap-8 border-b-0 p-4 md:rounded-t-4xl md:border">
        {/* 프로필 정보 섹션 */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">내 정보</h2>
            <p className="text-muted-foreground text-sm">
              내 프로필 정보를 확인하고 수정할 수 있습니다.
            </p>
          </div>

          <div className="bg-muted/30 flex flex-col gap-6 rounded-2xl border p-4">
            {/* 이름/이메일 + 프로필 이미지 */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">
                  {profile?.display_name ?? "이름 없음"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {profile?.email}
                </p>
              </div>
              <img
                src={profile?.avatar_url ?? defaultAvatar}
                alt="프로필 이미지"
                className="h-16 w-16 rounded-full border object-cover"
              />
            </div>

            {/* 개인정보 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-16 text-sm">
                  연락처
                </span>
                <span className="text-sm font-medium">
                  {profile?.phone_number ?? "등록된 연락처 없음"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-16 text-sm">생일</span>
                <span className="text-sm font-medium">
                  {profile?.birth_date ?? "등록된 생일 없음"}
                </span>
              </div>
            </div>

            {/* 내 프로필인 경우만 프로필 수정 버튼 표시 */}
            {isMine && (
              <Button
                variant="outline"
                className="w-full cursor-pointer rounded-xl"
                asChild
              >
                <Link to="/profile/edit">프로필 수정</Link>
              </Button>
            )}
          </div>
        </section>

        {/* 가족 그룹 섹션 */}
        {isMine && (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">내 가족</h2>
              <p className="text-muted-foreground text-sm">
                소속된 가족 그룹과 멤버들을 확인합니다.
              </p>
            </div>

            {isLoadingFamilies ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : families.length === 0 ? (
              <div className="bg-muted/30 flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
                <p className="text-muted-foreground mb-4 text-sm">
                  아직 소속된 가족이 없어요
                </p>
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer rounded-xl"
                    asChild
                  >
                    <Link to="/family/join">가족 가입</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer rounded-xl"
                    asChild
                  >
                    <Link to="/family/create">가족 생성</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {families.map((family) => (
                  <div
                    key={family.id}
                    className="bg-muted/30 flex flex-col gap-4 rounded-2xl border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{family.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {family.members.length}명
                        </span>
                      </div>
                      <Link
                        to={`/family/${family.id}/setting`}
                        className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* 가족 멤버 리스트 */}
                    <div className="flex gap-4 overflow-x-auto pb-1">
                      {family.members.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedMember(member)}
                          className="group flex shrink-0 cursor-pointer flex-col items-center gap-1 focus:outline-none"
                        >
                          <img
                            src={member.user.avatar_url ?? defaultAvatar}
                            alt={member.display_name ?? "멤버"}
                            className="group-hover:border-primary size-12 rounded-full border object-cover transition-colors"
                          />
                          <span className="group-hover:text-primary text-xs font-medium">
                            {member.display_name ?? member.user.display_name}
                          </span>
                          {member.family_role && (
                            <span className="text-muted-foreground text-[10px]">
                              {member.family_role}
                            </span>
                          )}
                        </button>
                      ))}

                      {/* 가족 초대 버튼 */}
                      <Link
                        to={`/family/${family.id}/invite`}
                        className="group flex shrink-0 flex-col items-center gap-1"
                      >
                        <div className="group-hover:border-primary group-hover:bg-primary/5 flex size-12 items-center justify-center rounded-full border border-dashed transition-colors">
                          <Plus className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-primary text-xs font-medium">
                          초대
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}

                {/* 추가 가족 가입/생성 버튼 */}

                {isMine && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground flex-1 rounded-xl"
                      asChild
                    >
                      <Link to="/family/join">가족 가입</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground flex-1 rounded-xl"
                      asChild
                    >
                      <Link to="/family/create">가족 생성</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      {/* TODO: 내 게시글 리스트 - 추후 구현 예정
      <div className="border-t border-t-black">
        <div className="border-b p-4">
          <h2 className="font-medium">내 게시글</h2>
        </div>
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
      */}

      {/* 가족 멤버 프로필 모달 */}
      <FamilyMemberProfileModal
        member={selectedMember}
        open={selectedMember !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }}
      />
    </main>
  );
}
