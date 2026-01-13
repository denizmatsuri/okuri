import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, Home, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/store/session";
import { useCreateFamily } from "@/hooks/mutations/family/use-create-family";
import { toast } from "sonner";

type Step = 1 | 2;

export default function CreateFamilyPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1: 가족 정보
  const [familyName, setFamilyName] = useState("");
  const [familyDescription, setFamilyDescription] = useState("");

  // Step 2: 내 프로필
  const [displayName, setDisplayName] = useState("");
  const [familyRole, setFamilyRole] = useState("");

  const { mutate: createFamily, isPending: isCreating } = useCreateFamily({
    onSuccess: () => {
      navigate(`/profile/${session!.user.id}`);
      toast.success("가족 생성 성공", { position: "top-center" });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleNextStep = () => {
    if (step === 1 && familyName.trim()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) return;

    createFamily({
      name: familyName,
      description: familyDescription,
      userId: session!.user.id,
      displayName,
      familyRole,
    });
  };

  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* 헤더 */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/no-family">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-xl">새 가족 만들기</CardTitle>
              <CardDescription>
                {step === 1 ? "가족 정보를 입력하세요" : "가족 내 프로필 설정"}
              </CardDescription>
            </div>
          </div>
          {/* 스텝 인디케이터 */}
          <div className="mt-4 flex gap-2">
            <div
              className={`h-1 flex-1 rounded-full ${
                step >= 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full ${
                step >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step 1: 가족 정보 */}
            {step === 1 && (
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

                <Button
                  type="button"
                  size="lg"
                  className="mt-2 w-full"
                  onClick={handleNextStep}
                  disabled={!familyName.trim()}
                >
                  다음
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            )}

            {/* Step 2: 내 프로필 */}
            {step === 2 && (
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
                    value={familyRole}
                    onChange={(e) => setFamilyRole(e.target.value)}
                    placeholder="예: 아빠, 엄마, 막내, 첫째, (선택)"
                  />
                </div>

                <div className="mt-2 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="mr-1 size-4" />
                    이전
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={!displayName.trim() || isCreating}
                  >
                    <Check className="mr-1 size-4" />
                    {isCreating ? "생성 중..." : "완료"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
