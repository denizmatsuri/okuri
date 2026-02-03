import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileStep, {
  type ProfileFormData,
} from "@/components/family/profile-step";
import FamilyInfoStep, {
  type FamilyInfoFormData,
} from "@/components/family/family-info-step";
import FamilyMemberStep from "@/components/family/family-member-step";
import { useSession } from "@/store/session";
import { useCreateFamily } from "@/hooks/mutations/family/use-create-family";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type Step = 1 | 2 | 3;

export default function CreateFamilyPage() {
  const session = useSession();
  const navigate = useNavigate();
  useScrollToTop();

  // 프로필 데이터 조회
  const { data: profile, isLoading: isProfileLoading } = useUserProfileData(
    session?.user.id,
  );

  // step이 null이면 초기값 사용, 사용자가 이동하면 명시적으로 설정됨
  const [step, setStep] = useState<Step | null>(null);

  // 각 Step에서 수집한 데이터 저장
  const [familyInfoData, setFamilyInfoData] =
    useState<FamilyInfoFormData | null>(null);

  // 프로필 업데이트 mutation
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile({
      onSuccess: () => {
        toast.success("프로필이 저장되었습니다.", { position: "top-center" });
        setStep(2);
      },
      onError: (error) => {
        toast.error(error.message || "프로필 저장 실패", {
          position: "top-center",
        });
      },
    });

  // 가족 생성 mutation
  const { mutate: createFamily, isPending: isCreating } = useCreateFamily({
    onSuccess: () => {
      navigate(`/profile/${session!.user.id}`);
      toast.success("가족 생성 성공", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(error.message || "가족 생성 실패", {
        position: "top-center",
      });
    },
  });

  // 프로필 로딩 중
  if (isProfileLoading) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <p className="text-muted-foreground">프로필을 확인하는 중...</p>
      </div>
    );
  }

  // 프로필 완성 여부 확인
  const isProfileComplete =
    profile?.display_name && profile?.phone_number && profile?.birth_date;

  // 실제 사용할 step (null이면 프로필 완성 여부에 따라 초기값 결정)
  const currentStep: Step = step ?? (isProfileComplete ? 2 : 1);

  // 현재 표시할 스텝 수 (프로필 완성 시 2개, 아니면 3개)
  const totalSteps = isProfileComplete ? 2 : 3;

  // 실제 표시용 스텝 번호 (프로필 완성 시 currentStep-1)
  const displayStep = isProfileComplete ? currentStep - 1 : currentStep;

  // 현재 스텝 설명 텍스트
  const getStepDescription = () => {
    if (currentStep === 1) return "먼저 프로필을 만들어보세요";
    if (currentStep === 2) return "가족 정보를 입력하세요";
    return "가족 내 프로필 설정";
  };

  // Step 1 완료 핸들러
  const handleProfileComplete = (data: ProfileFormData) => {
    updateProfile({
      userId: session!.user.id,
      display_name: data.profileName,
      phone_number: data.phoneNumber,
      birth_date: data.birthDate,
      avatarImageFile: data.avatarFile,
    });
  };

  // Step 2 완료 핸들러
  const handleFamilyInfoComplete = (data: FamilyInfoFormData) => {
    setFamilyInfoData(data);
    setStep(3);
  };

  // 최종 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!familyInfoData) return;

    const formData = new FormData(e.currentTarget);
    const displayName = formData.get("displayNameValue") as string;
    const familyRole = formData.get("familyRoleValue") as string;

    if (!displayName?.trim()) return;

    createFamily({
      name: familyInfoData.familyName,
      description: familyInfoData.familyDescription,
      userId: session!.user.id,
      displayName: displayName.trim(),
      familyRole: familyRole?.trim() || "",
    });
  };

  // Step 뒤로가기
  const handlePrevStep = () => {
    if (currentStep === 3) {
      setStep(2);
    } else if (currentStep === 2 && !isProfileComplete) {
      setStep(1);
    }
  };

  // 뒤로가기 버튼 핸들러
  const handleBack = () => {
    if (currentStep === 3) {
      setStep(2);
    } else if (currentStep === 2) {
      if (isProfileComplete) {
        navigate(-1);
      } else {
        setStep(1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex h-full min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <CardTitle className="text-xl">새 가족 만들기</CardTitle>
              <CardDescription>{getStepDescription()}</CardDescription>
            </div>
          </div>
          {/* 스텝 인디케이터 */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  displayStep >= i + 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step 1: 내 프로필 생성 */}
            {currentStep === 1 && !isProfileComplete && (
              <ProfileStep
                onComplete={handleProfileComplete}
                isSubmitting={isUpdatingProfile}
              />
            )}

            {/* Step 2: 가족 정보 */}
            {currentStep === 2 && (
              <FamilyInfoStep
                onComplete={handleFamilyInfoComplete}
                onPrev={handlePrevStep}
                showPrevButton={!isProfileComplete}
              />
            )}

            {/* Step 3: 가족 내 프로필 */}
            {currentStep === 3 && familyInfoData && (
              <FamilyMemberStep
                familyName={familyInfoData.familyName}
                onPrev={handlePrevStep}
                isSubmitting={isCreating}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
