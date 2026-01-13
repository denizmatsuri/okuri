import { useSession } from "@/store/session";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import PostItem from "@/components/post/post-item";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { LogOut, Plus, Settings } from "lucide-react";
import Loader from "@/components/loader";
import { useFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import type { FamilyWithMembers } from "@/types";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useLeaveFamily } from "@/hooks/mutations/family/use-leave-family";
import { toast } from "sonner";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const { data: profile } = useUserProfileData(userId);

  const session = useSession();
  const isMine = userId === session?.user.id;

  // 현재 사용자가 해당 가족의 어드민인지 확인
  // const isAdminOf = (family: FamilyWithMembers) =>
  //   family.members.some(
  //     (member) => member.user_id === session?.user.id && member.is_admin,
  //   );

  // 페이지 접속시 페이지 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const { data: families = [], isLoading: isLoadingFamilies } =
    useFamiliesWithMembers(userId);

  const leaveFamilyMutation = useLeaveFamily({
    onSuccess: () => {
      toast.success("가족에서 탈퇴했습니다", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  const handleLeaveFamily = (familyId: string) => {
    leaveFamilyMutation.mutate({ familyId, userId: session!.user.id });
  };

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
        {isMine && (
          <div className="flex flex-col gap-4">
            <h2 className="font-medium">내 가족</h2>

            {isLoadingFamilies ? (
              <Loader />
            ) : families.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                아직 소속된 가족이 없어요
              </p>
            ) : (
              <div className="divide-y">
                {families.map((family) => (
                  <div
                    key={family.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {family.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          · {family.members.length}명
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* 가족 탈퇴 버튼 */}
                        {/* <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <LogOut className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>가족 탈퇴</AlertDialogTitle>
                              <AlertDialogDescription>
                                가족 탈퇴하시겠습니까?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLeaveFamily(family.id)}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={leaveFamilyMutation.isPending}
                              >
                                탈퇴
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog> */}

                        {/* 내 가족 프로필 수정 기능(Admin만) */}
                        <Link
                          to={`/family/${family.id}/setting`}
                          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-1">
                      {family.members.map((member) => (
                        <Link
                          key={member.id}
                          to={`/profile/${member.user_id}`}
                          className="group flex shrink-0 flex-col items-center gap-1"
                        >
                          <img
                            src={member.user.avatar_url ?? defaultAvatar}
                            alt={member.display_name ?? "멤버"}
                            className="group-hover:border-accent-foreground h-12 w-12 rounded-full border object-cover transition-colors"
                          />
                          <span className="group-hover:text-primary text-xs">
                            {member.display_name ?? member.user.display_name}
                          </span>
                          {member.family_role && (
                            <span className="text-muted-foreground text-[10px]">
                              {member.family_role}
                            </span>
                          )}
                        </Link>
                      ))}

                      {/* 가족 초대 버튼 */}
                      <Link
                        to={`/family/${family.id}/invite`}
                        className="group flex shrink-0 flex-col items-center gap-1"
                      >
                        <div className="group-hover:border-primary group-hover:bg-primary/5 flex h-12 w-12 items-center justify-center rounded-full border border-dashed transition-colors">
                          <Plus className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-primary text-xs">
                          초대
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isMine && (
          <div className="flex flex-col gap-2">
            <div className="flex w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                asChild
              >
                <Link to="/family/join">가족 가입</Link>
              </Button>
            </div>
            <div className="flex w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                asChild
              >
                <Link to="/family/create">가족 생성</Link>
              </Button>
            </div>
          </div>
        )}
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
