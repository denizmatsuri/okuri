import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/store/session";
import { useFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import { useUpdateFamily } from "@/hooks/mutations/family/use-update-family";
// import { useRemoveFamilyMember } from "@/hooks/mutations/family/use-remove-family-member";
import defaultAvatar from "@/assets/default-avatar.jpg";
import Loader from "@/components/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { FamilyMember } from "@/types";

export default function FamilySettingPage() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const userId = session?.user.id;

  const { data: families = [], isLoading } = useFamiliesWithMembers(userId);
  const family = families.find((f) => f.id === familyId);

  // 현재 사용자가 Admin인지 확인
  const currentMember = family?.members.find((m) => m.user_id === userId);
  const isAdmin = currentMember?.is_admin ?? false;

  // 폼 상태
  const [name, setName] = useState(family?.name ?? "");
  const [description, setDescription] = useState(family?.description ?? "");

  const updateFamilyMutation = useUpdateFamily({
    onSuccess: () => {
      toast.success("가족 정보가 수정되었습니다");
    },
    onError: () => {
      toast.error("가족 정보 수정에 실패했습니다");
    },
  });

  // TODO: 멤버 추방 기능 구현
  // const removeMemberMutation = useRemoveFamilyMember(userId ?? "", {
  //   onSuccess: () => {
  //     toast.success("멤버가 추방되었습니다");
  //   },
  //   onError: () => {
  //     toast.error("멤버 추방에 실패했습니다");
  //   },
  // });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId) return;

    updateFamilyMutation.mutate({
      familyId,
      name: name.trim(),
      description: description.trim() || null,
    });
  };

  const handleRemoveMember = (member: FamilyMember) => {
    if (!familyId) return;

    // TODO: 멤버 추방 기능 구현
    alert("멤버 추방!");
    // removeMemberMutation.mutate({
    //   memberId: member.id,
    //   familyId,
    // });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!family || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">접근 권한이 없습니다</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) w-full flex-1 border-x md:m-0">
      {/* 헤더 */}
      <div className="flex items-center gap-2 border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">가족 관리</h1>
      </div>

      <div className="flex flex-col gap-6 p-4">
        {/* 가족 정보 수정 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-medium">가족 정보</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              가족 이름
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="가족 이름을 입력하세요"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              설명 (선택)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="가족에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={updateFamilyMutation.isPending || !name.trim()}
            className="w-full"
          >
            {updateFamilyMutation.isPending ? "저장 중..." : "저장"}
          </Button>
        </form>

        {/* 구분선 */}
        <hr />

        {/* 멤버 관리 */}
        <div className="flex flex-col gap-4">
          <h2 className="font-medium">가족 구성원</h2>

          <div className="flex flex-col divide-y">
            {family.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar_url ?? defaultAvatar}
                    alt={member.display_name ?? "멤버"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {member.display_name ?? member.user.display_name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {member.family_role}
                      {member.is_admin && " · 관리자"}
                    </span>
                  </div>
                </div>

                {/* 자기 자신 제외, Admin이 아닌 멤버만 추방 가능 */}
                {member.user_id !== userId && !member.is_admin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>멤버 추방</AlertDialogTitle>
                        <AlertDialogDescription>
                          {member.display_name ?? member.user.display_name}님을
                          가족에서 내보내시겠습니까? 이 작업은 되돌릴 수
                          없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveMember(member)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          추방
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
