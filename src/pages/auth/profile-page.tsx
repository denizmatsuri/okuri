import { useSession } from "@/store/session";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import PostItem from "@/components/post/post-item";
import defaultAvatar from "@/assets/default-avatar.jpg";
import type { FamilyWithMembers } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

// TODO: 가족 데이터 API 연동 후 제거
const mockFamilies: FamilyWithMembers[] = [
  {
    id: "1",
    name: "A 가족",
    description: null,
    created_by: null,
    invite_code: null,
    invite_code_expires_at: null,
    created_at: "",
    updated_at: "",
    members: [
      {
        id: "1",
        user_id: "1",
        family_id: "1",
        display_name: "엄마",
        avatar_url: null,
        family_role: "엄마",
        is_admin: true,
        joined_at: null,
        user: {
          id: "1",
          email: "mom@test.com",
          display_name: "엄마",
          avatar_url: null,
          birth_date: null,
          phone_number: null,
          notification: true,
          created_at: "",
        },
      },
    ],
  },
];

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const { data: profile } = useUserProfileData(userId);

  const session = useSession();
  const isMine = userId === session?.user.id;

  // 페이지 접속시 페이지 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // TODO: 가족 데이터 훅으로 교체
  const families = mockFamilies;

  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) w-full flex-1 border-x md:m-0">
      {/* 프로필 섹션 */}
      <div className="flex flex-col gap-6 p-4">
        {/* 이름/이메일 + 프로필 이미지 */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">
              {profile?.display_name ?? "이름 없음"}
            </h1>
            <p className="text-muted-foreground text-sm">{profile?.email}</p>
          </div>
          <img
            src={profile?.avatar_url ?? defaultAvatar}
            alt="프로필 이미지"
            className="h-16 w-16 rounded-full border object-cover"
          />
        </div>

        {/* 개인정보 */}
        <div className="flex flex-col gap-2 border-b pb-4">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 text-sm">연락처</span>
            <span className="text-sm">
              {profile?.phone_number ?? "등록된 연락처 없음"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 text-sm">생일</span>
            <span className="text-sm">
              {profile?.birth_date ?? "등록된 생일 없음"}
            </span>
          </div>
        </div>

        {/* 내 프로필인 경우만 프로필 수정 버튼 표시 */}
        {isMine && (
          <div className="flex w-full justify-end">
            <Button variant="outline" className="w-full cursor-pointer" asChild>
              <Link to="/profile/edit">프로필 수정</Link>
            </Button>
          </div>
        )}

        {/* 가족 그룹 */}
        {/* FIXME: 내 계정이면서도 가족 그룹에 속해있는 경우만 표시 */}
        <div className="flex flex-col gap-4">
          <h2 className="font-medium">내 가족</h2>
          {families.map((family) => (
            <div key={family.id} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{family.name}</span>
              <div className="flex gap-2">
                {family.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <img
                      src={member.avatar_url ?? defaultAvatar}
                      alt={member.display_name ?? "멤버"}
                      className="h-10 w-10 rounded-full border object-cover"
                    />
                    <span className="text-xs">
                      {member.display_name ?? member.user.display_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 내가 작성한 포스트 리스트 */}
      <div className="border-t border-t-black">
        <div className="border-b p-4">
          <h2 className="font-medium">내 게시글</h2>
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostItem key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
