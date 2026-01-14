import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import defaultAvatar from "@/assets/default-avatar.jpg";
import { useSession } from "@/store/session";
import { useUpdateFamilyMember } from "@/hooks/mutations/family/use-update-family-member";
import type { FamilyMember } from "@/types";

type Props = {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FamilyMemberProfileModal({
  member,
  open,
  onOpenChange,
}: Props) {
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [familyRole, setFamilyRole] = useState("");

  const isMine = member?.user_id === session?.user.id;

  const { mutate: updateFamilyMember, isPending: isUpdating } =
    useUpdateFamilyMember({
      onSuccess: () => {
        toast.success("프로필이 수정되었습니다", { position: "top-center" });
        setIsEditing(false);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message, { position: "top-center" });
        setIsEditing(false);
      },
    });

  // 수정 모드 진입 시 현재 값으로 초기화
  const handleEditClick = () => {
    if (!member) return;
    setDisplayName(member.display_name ?? member.user.display_name ?? "");
    setFamilyRole(member.family_role ?? "");
    setIsEditing(true);
  };

  // 수정 저장
  const handleSave = () => {
    if (!member) return;
    updateFamilyMember({
      memberId: member.id,
      familyId: member.family_id,
      displayName: displayName.trim() || undefined,
      familyRole: familyRole.trim() || null,
    });
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 모달 닫힐 때 수정 모드 초기화
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditing(false);
    }
    onOpenChange(newOpen);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()} // 모달 열릴 때 닫기버튼 자동 포커스 방지
      >
        <DialogHeader>
          <DialogTitle className="sr-only">가족 멤버 프로필</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* 프로필 이미지 */}
          <img
            src={member.user.avatar_url ?? defaultAvatar}
            alt={member.display_name ?? "멤버"}
            className="h-24 w-24 rounded-full border object-cover"
          />

          {/* 수정 모드 */}
          {isEditing ? (
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName">가족 내 표시 이름</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="가족 내 표시 이름"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="familyRole">가족 내 역할</Label>
                <Input
                  id="familyRole"
                  value={familyRole}
                  onChange={(e) => setFamilyRole(e.target.value)}
                  placeholder="예: 아빠, 엄마, 막내"
                />
              </div>
            </div>
          ) : (
            <>
              {/* 보기 모드 */}
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-lg font-semibold">
                  {member.display_name ?? member.user.display_name}
                </h3>
                {member.family_role && (
                  <span className="text-muted-foreground text-sm">
                    {member.family_role}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼 */}
        {isMine && (
          <DialogFooter>
            {isEditing ? (
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  저장
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleEditClick}
              >
                수정
              </Button>
            )}
          </DialogFooter>
        )}

        {/* 추가 정보 */}
        <div className="flex w-full flex-col gap-2 border-t pt-4">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 text-sm">연락처</span>
            <span className="text-sm">
              {member.user.phone_number ?? "등록된 연락처 없음"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 text-sm">생일</span>
            <span className="text-sm">
              {member.user.birth_date ?? "등록된 생일 없음"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
