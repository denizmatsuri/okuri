import { Button } from "@/components/ui/button";
import defaultAvatar from "@/assets/default-avatar.jpg";
import type { FamilyMember } from "@/types";

export default function MemberItem({
  member,
  isCurrentUser,
  isAdmin,
  onRemove,
  onGrantAdmin,
}: {
  member: FamilyMember;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onRemove: (member: FamilyMember) => void;
  onGrantAdmin: (member: FamilyMember) => void;
}) {
  const showActions = isAdmin && !isCurrentUser && !member.is_admin;

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
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

      {showActions && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGrantAdmin(member)}
          >
            관리자 지정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onRemove(member)}
          >
            내보내기
          </Button>
        </div>
      )}
    </div>
  );
}
