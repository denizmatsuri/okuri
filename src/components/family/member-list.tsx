import { toast } from "sonner";
import { useRemoveFamilyMember } from "@/hooks/mutations/family/use-remove-family-member";
import { useGrantAdmin } from "@/hooks/mutations/family/use-grant-admin";
import { useOpenAlertModal } from "@/store/alert-modal";
import MemberItem from "@/components/family/member-item";
import type { FamilyMember } from "@/types";

export default function MemberList({
  familyId,
  members,
  currentUserId,
  isAdmin,
}: {
  familyId: string;
  members: FamilyMember[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const openAlertModal = useOpenAlertModal();

  const removeMemberMutation = useRemoveFamilyMember(currentUserId, {
    onSuccess: () => {
      toast.success("멤버가 추방되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("멤버 추방에 실패했습니다", { position: "top-center" });
    },
  });

  const grantAdminMutation = useGrantAdmin(currentUserId, {
    onSuccess: () => {
      toast.success("관리자 권한이 부여되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("관리자 권한 부여에 실패했습니다", { position: "top-center" });
    },
  });

  const handleRemoveMember = (member: FamilyMember) => {
    openAlertModal({
      title: "멤버 추방",
      description: "정말 멤버를 추방하시겠습니까?",
      onPositive: () => {
        removeMemberMutation.mutate({ memberId: member.id, familyId });
      },
    });
  };

  const handleGrantAdmin = (member: FamilyMember) => {
    openAlertModal({
      title: "관리자 권한 부여",
      description: "정말 관리자 권한을 부여하시겠습니까?",
      onPositive: () => {
        grantAdminMutation.mutate({ memberId: member.id, familyId });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium">가족 구성원</h2>

      <div className="flex flex-col divide-y">
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            isCurrentUser={member.user_id === currentUserId}
            isAdmin={isAdmin}
            onRemove={handleRemoveMember}
            onGrantAdmin={handleGrantAdmin}
          />
        ))}
      </div>
    </div>
  );
}
