import { useState } from "react";
import { ArrowLeft, Check, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FamilyMemberFormData = {
  displayName: string;
  familyRole: string;
};

type Props = {
  familyName: string;
  onPrev: () => void;
  isSubmitting: boolean;
};

export default function FamilyMemberStep({
  familyName,
  onPrev,
  isSubmitting,
}: Props) {
  const [displayName, setDisplayName] = useState("");
  const [familyRole, setFamilyRole] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/10 mx-auto flex size-14 items-center justify-center rounded-full">
        <Users className="text-primary size-7" />
      </div>

      <p className="text-muted-foreground text-center text-sm">
        <strong className="text-foreground">{familyName}</strong>
        에서 사용할 프로필을 설정하세요
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="display-name">
          표시 이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="display-name"
          type="text"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="예: 철수, 영희, 돌쇠"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="family-role">역할</Label>
        <Input
          id="family-role"
          type="text"
          name="familyRole"
          value={familyRole}
          onChange={(e) => setFamilyRole(e.target.value)}
          placeholder="예: 아빠, 엄마, 막내, 첫째, (선택)"
        />
      </div>

      {/* hidden inputs for form submission */}
      <input type="hidden" name="displayNameValue" value={displayName} />
      <input type="hidden" name="familyRoleValue" value={familyRole} />

      <div className="mt-2 flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onPrev}
        >
          <ArrowLeft className="mr-1 size-4" />
          이전
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={!displayName.trim() || isSubmitting}
        >
          <Check className="mr-1 size-4" />
          {isSubmitting ? "생성 중..." : "완료"}
        </Button>
      </div>
    </div>
  );
}
