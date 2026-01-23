import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/store/session";
import { useFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import { useUpdateFamily } from "@/hooks/mutations/family/use-update-family";
import { useRemoveFamilyMember } from "@/hooks/mutations/family/use-remove-family-member";
import defaultAvatar from "@/assets/default-avatar.jpg";
import Loader from "@/components/loader";
import type { FamilyMember } from "@/types";
import { useGrantAdmin } from "@/hooks/mutations/family/use-grant-admin";
import { useDeleteFamily } from "@/hooks/mutations/family/use-delete-family";
import { useLeaveFamily } from "@/hooks/mutations/family/use-leave-family";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function FamilySettingPage() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const userId = session?.user.id;
  const openAlertModal = useOpenAlertModal();

  const { data: families = [], isLoading } = useFamiliesWithMembers(userId);
  const family = families.find((f) => f.id === familyId);

  // 현재 사용자가 Admin인지 확인
  const currentMember = family?.members.find((m) => m.user_id === userId);
  const isAdmin = currentMember?.is_admin ?? false;

  // 폼 상태
  const [name, setName] = useState(family?.name ?? "");
  const [description, setDescription] = useState(family?.description ?? "");

  // 가족 정보 수정 mutation
  const updateFamilyMutation = useUpdateFamily({
    onSuccess: () => {
      toast.success("가족 정보가 수정되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("가족 정보 수정에 실패했습니다", { position: "top-center" });
    },
  });

  // 멤버 추방 mutation
  const removeMemberMutation = useRemoveFamilyMember(userId ?? "", {
    onSuccess: () => {
      toast.success("멤버가 추방되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("멤버 추방에 실패했습니다", { position: "top-center" });
    },
  });

  // 관리자 권한 부여 mutation
  const grantAdminMutation = useGrantAdmin(userId as string, {
    onSuccess: () => {
      toast.success("관리자 권한이 부여되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("관리자 권한 부여에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  // 가족 삭제 mutation
  const deleteFamilyMutation = useDeleteFamily({
    onSuccess: () => {
      toast.success("가족이 삭제되었습니다", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(error.message || "가족 삭제에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  // 가족 나가기 mutation
  const leaveFamilyMutation = useLeaveFamily({
    onSuccess: () => {
      toast.success("가족을 나갔습니다", { position: "top-center" });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-center",
      });
    },
  });

  // 가족 정보 수정
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId) return;

    updateFamilyMutation.mutate({
      familyId,
      name: name.trim(),
      description: description.trim() || null,
    });
  };

  // 멤버 추방
  const handleRemoveMember = (member: FamilyMember) => {
    if (!familyId) return;

    openAlertModal({
      title: "멤버 추방",
      description: "정말 멤버를 추방하시겠습니까?",
      onPositive: () => {
        removeMemberMutation.mutate({ memberId: member.id, familyId });
      },
      onNegative: () => {
        console.log("취소");
      },
    });
  };

  // 관리자 권한 부여
  const handleGrantAdmin = (member: FamilyMember) => {
    if (!familyId) return;
    openAlertModal({
      title: "관리자 권한 부여",
      description: "정말 관리자 권한을 부여하시겠습니까?",
      onPositive: () => {
        grantAdminMutation.mutate({ memberId: member.id, familyId });
      },
      onNegative: () => {
        console.log("취소");
      },
    });
  };

  // 가족 삭제
  const handleDeleteFamily = () => {
    if (!familyId || !userId) return;
    openAlertModal({
      title: "정말 가족을 삭제하시겠습니까?",
      description: `${family?.name}을(를) 가족 삭제시 모든 멤버가 자동으로 제거되고, 관련된 모든 데이터(게시물, 사진 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`,
      onPositive: () => {
        deleteFamilyMutation.mutate({ familyId, userId });
      },
      onNegative: () => {
        console.log("취소");
      },
    });
  };

  // 가족 나가기 핸들러 추가
  const handleLeaveFamily = () => {
    if (!familyId || !userId) return;
    openAlertModal({
      title: "정말 가족을 나가시겠습니까?",
      description: `${family?.name}을(를) 나가면 더 이상 이 가족의 게시물과 사진에 접근할 수 없습니다. 다시 참여하려면 초대 코드가 필요합니다.`,
      onPositive: () => {
        leaveFamilyMutation.mutate({ familyId, userId });
      },
      onNegative: () => {
        console.log("취소");
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  const isPending =
    updateFamilyMutation.isPending ||
    removeMemberMutation.isPending ||
    grantAdminMutation.isPending ||
    deleteFamilyMutation.isPending ||
    leaveFamilyMutation.isPending;

  if (!family) {
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
              disabled={!isAdmin}
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
              disabled={!isAdmin}
            />
          </div>

          {isAdmin && (
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full"
            >
              저장
            </Button>
          )}
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
                    src={member.user.avatar_url ?? defaultAvatar}
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

                {/* 자기 자신 제외, Admin이 아닌 멤버만 액션 가능 */}
                {member.user_id !== userId && !member.is_admin && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGrantAdmin(member)}
                    >
                      관리자 지정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveMember(member)}
                    >
                      내보내기
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <hr />

        {/* 가족 나가기 섹션 - 새로 추가 (관리자가 아닌 경우에만 표시) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-destructive font-medium">가족 나가기</h2>
          <p className="text-muted-foreground text-sm">
            가족을 나가면 더 이상 이 가족의 게시물과 사진에 접근할 수 없습니다.
            다시 참여하려면 초대 코드가 필요합니다.
          </p>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeaveFamily}
            disabled={isPending}
          >
            가족 나가기
          </Button>
        </div>
        <hr />

        {/* 위험 영역 - 가족 삭제 */}
        {isAdmin && (
          <div className="flex flex-col gap-4">
            <h2 className="text-destructive font-medium">가족 삭제</h2>
            <p className="text-muted-foreground text-sm">
              가족을 삭제하면 모든 멤버가 가족에서 제거되고, 관련된 모든
              데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteFamily}
              disabled={isPending}
            >
              가족 삭제
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
