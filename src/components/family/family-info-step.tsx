import { useState } from "react";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type FamilyInfoFormData = {
  familyName: string;
  familyDescription: string;
};

type Props = {
  onComplete: (data: FamilyInfoFormData) => void;
  onPrev?: () => void;
  showPrevButton: boolean;
};

export default function FamilyInfoStep({
  onComplete,
  onPrev,
  showPrevButton,
}: Props) {
  const [familyName, setFamilyName] = useState("");
  const [familyDescription, setFamilyDescription] = useState("");

  const handleNext = () => {
    if (!familyName.trim()) return;

    onComplete({
      familyName: familyName.trim(),
      familyDescription: familyDescription.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/10 mx-auto flex size-14 items-center justify-center rounded-full">
        <Home className="text-primary size-7" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="family-name">
          가족 이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="family-name"
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="예: 김씨네 가족"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="family-description">가족 소개</Label>
        <Textarea
          id="family-description"
          value={familyDescription}
          onChange={(e) => setFamilyDescription(e.target.value)}
          placeholder="우리 가족을 소개해주세요 (선택)"
          rows={3}
        />
      </div>

      <div className="mt-2 flex gap-3">
        {showPrevButton && onPrev && (
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
        )}
        <Button
          type="button"
          size="lg"
          className={showPrevButton ? "flex-1" : "w-full"}
          onClick={handleNext}
          disabled={!familyName.trim()}
        >
          다음
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
