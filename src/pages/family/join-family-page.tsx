import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, Search, Users } from "lucide-react";
import { toast } from "sonner";

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
import { useSession } from "@/store/session";
import { useJoinFamily } from "@/hooks/mutations/family/use-join-family";
import { fetchFamilyByInviteCode } from "@/api/family";
import type { FamilyEntity } from "@/types";

type Step = 1 | 2;

export default function JoinFamilyPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1: 초대 코드
  const [inviteCode, setInviteCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundFamily, setFoundFamily] = useState<FamilyEntity | null>(null);

  // Step 2: 내 프로필
  const [displayName, setDisplayName] = useState("");
  const [familyRole, setFamilyRole] = useState("");

  const { mutate: joinFamily, isPending: isJoining } = useJoinFamily({
    onSuccess: () => {
      navigate("/");
      toast.success("가족에 가입되었습니다!", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(error.message || "가입에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  // 초대 코드로 가족 검색
  const handleSearchFamily = async () => {
    if (!inviteCode.trim()) return;

    setIsSearching(true);
    try {
      const family = await fetchFamilyByInviteCode(
        inviteCode.trim().toUpperCase(),
      );
      setFoundFamily(family);
      setStep(2);
    } catch {
      toast.error("유효하지 않은 초대 코드입니다", { position: "top-center" });
      setFoundFamily(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
      setFoundFamily(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim() || !foundFamily) return;

    joinFamily({
      inviteCode: inviteCode.trim().toUpperCase(),
      userId: session!.user.id,
      displayName,
      familyRole,
    });
  };
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* 헤더 */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <CardTitle className="text-xl">초대 코드로 가입</CardTitle>
              <CardDescription>
                {step === 1 ? "초대 코드를 입력하세요" : "가족 내 프로필 설정"}
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
            {/* Step 1: 초대 코드 입력 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="bg-primary/10 mx-auto flex size-14 items-center justify-center rounded-full">
                  <Search className="text-primary size-7" />
                </div>

                <p className="text-muted-foreground text-center text-sm">
                  가족 관리자에게 받은 6자리 초대 코드를 입력하세요
                </p>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="invite-code">
                    초대 코드 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="invite-code"
                    type="text"
                    value={inviteCode}
                    onChange={(e) =>
                      setInviteCode(e.target.value.toUpperCase())
                    }
                    placeholder="예: ABC123"
                    maxLength={6}
                    className="text-center font-mono text-lg tracking-widest"
                    required
                  />
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="mt-2 w-full"
                  onClick={handleSearchFamily}
                  disabled={inviteCode.length < 6 || isSearching}
                >
                  {isSearching ? "검색 중..." : "가족 찾기"}
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            )}

            {/* Step 2: 가족 확인 + 프로필 설정 */}
            {step === 2 && foundFamily && (
              <div className="flex flex-col gap-4">
                <div className="bg-primary/10 mx-auto flex size-14 items-center justify-center rounded-full">
                  <Users className="text-primary size-7" />
                </div>

                {/* 가입할 가족 정보 */}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-muted-foreground text-sm">가입할 가족</p>
                  <p className="text-lg font-semibold">{foundFamily.name}</p>
                  {foundFamily.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {foundFamily.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="display-name">
                    표시 이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="예: 철수, 영희"
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
                    placeholder="예: 아빠, 엄마, 막내 (선택)"
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
                    disabled={!displayName.trim() || isJoining}
                  >
                    <Check className="mr-1 size-4" />
                    {isJoining ? "가입 중..." : "가입하기"}
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
