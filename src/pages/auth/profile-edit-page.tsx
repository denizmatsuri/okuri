import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";
import { useSession } from "@/store/session";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { generateErrorMessage } from "@/lib/error-messages";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { compressImageIfNeeded } from "@/lib/image";
import { SubHeader } from "@/components/layout/sub-header";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type ImagePreview = { file: File; previewUrl: string };

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const session = useSession();
  const { data: profile, isLoading: isFetchingProfilePending } =
    useUserProfileData(session?.user.id);

  const isMine = session?.user.id === profile?.id;

  useScrollToTop();
  useEffect(() => {
    if (profile && !isMine) {
      navigate("/");
    }
  }, [profile, isMine, navigate]);

  // 폼 상태 (프로필 데이터로 초기화)
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<ImagePreview | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // 프로필 데이터 로드 시 폼 상태 초기화
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setPhoneNumber(profile.phone_number ?? "");
      setBirthDate(profile.birth_date ?? "");
    }
  }, [profile]);

  // 컴포넌트 언마운트 시 Object URL 정리
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview.previewUrl);
      }
    };
  }, [avatarPreview]);

  const { mutate: updateUserProfile, isPending: isUpdatingUserProfilePending } =
    useUpdateProfile({
      onSuccess: () => {
        toast.success("프로필이 수정되었습니다.", { position: "top-center" });
        navigate(`/profile/${profile?.id}`);
      },
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
      },
    });

  // 로딩 상태
  if (isFetchingProfilePending) {
    return (
      <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 items-center justify-center md:m-0 md:bg-transparent">
        <p className="text-muted-foreground">프로필을 불러오는 중...</p>
      </main>
    );
  }

  // 본인 프로필이 아니거나 프로필이 없는 경우
  if (!profile || !isMine) {
    return (
      <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 items-center justify-center md:m-0 md:bg-transparent">
        <p className="text-muted-foreground">접근 권한이 없습니다.</p>
      </main>
    );
  }

  // 이미지 미리보기 핸들러
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0];

    // 이미지 압축 (3MB 초과 시 자동 압축)
    try {
      setIsCompressing(true);
      file = await compressImageIfNeeded(file, "avatar");
    } catch (error) {
      toast.error("이미지 처리에 실패했습니다.", { position: "top-center" });
      return;
    } finally {
      setIsCompressing(false);
    }

    if (avatarPreview) {
      // 기존 이미지의 임시 URL을 메모리에서 해제하여 메모리 누수 방지
      URL.revokeObjectURL(avatarPreview.previewUrl);
    }

    setAvatarPreview({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  // 이미지 삭제 핸들러
  const handleAvatarRemove = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview.previewUrl);
      setAvatarPreview(null);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim() === "") return;
    if (phoneNumber.trim() === "") return;
    if (birthDate.trim() === "") return;

    updateUserProfile({
      userId: profile.id,
      display_name: displayName,
      phone_number: phoneNumber,
      birth_date: birthDate,
      avatarImageFile: avatarPreview?.file,
    });
  };

  const isDisabled = isUpdatingUserProfilePending || isCompressing;

  return (
    <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 flex-col md:m-0 md:bg-transparent">
      {/* 헤더 */}
      <SubHeader title="프로필 수정" />

      {/* 폼 */}
      <form
        onSubmit={handleSubmit}
        className="md:bg-background flex flex-1 flex-col gap-6 border-b-0 p-4 md:rounded-t-4xl md:border"
      >
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <img
                src={
                  avatarPreview?.previewUrl ||
                  profile.avatar_url ||
                  defaultAvatar
                }
                alt="프로필 이미지"
                className="h-24 w-24 rounded-full border object-cover"
              />
              {isCompressing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isCompressing}
              />
            </label>
            {avatarPreview ? (
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={isCompressing}
                className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <div className="bg-primary text-primary-foreground pointer-events-none absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
                <Camera className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">프로필 사진</p>
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="display-name">이름</Label>
          <Input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        {/* 이메일 (수정 불가) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-muted-foreground text-xs">
            이메일은 변경할 수 없습니다
          </p>
        </div>

        {/* 연락처 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone-number">연락처</Label>
          <Input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="010-0000-0000"
            required
          />
        </div>

        {/* 생일 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="birth-date">생일</Label>
          <Input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 cursor-pointer"
            disabled={isDisabled}
          >
            저장
          </Button>
        </div>
      </form>
    </main>
  );
}
