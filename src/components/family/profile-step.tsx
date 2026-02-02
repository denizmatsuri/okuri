import { useEffect, useState } from "react";
import { ArrowRight, Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressImageIfNeeded } from "@/lib/image";
import defaultAvatar from "@/assets/default-avatar.jpg";

export type ProfileFormData = {
  profileName: string;
  phoneNumber: string;
  birthDate: string;
  avatarFile?: File;
};

type Props = {
  onComplete: (data: ProfileFormData) => void;
  isSubmitting: boolean;
};

export default function ProfileStep({ onComplete, isSubmitting }: Props) {
  const [profileName, setProfileName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // 컴포넌트 언마운트 시 Object URL 정리
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview.previewUrl);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0];

    try {
      setIsCompressing(true);
      file = await compressImageIfNeeded(file, "avatar");
    } catch {
      toast.error("이미지 처리에 실패했습니다.", { position: "top-center" });
      return;
    } finally {
      setIsCompressing(false);
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview.previewUrl);
    }

    setAvatarPreview({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    if (!profileName.trim() || !phoneNumber.trim() || !birthDate.trim()) return;

    onComplete({
      profileName: profileName.trim(),
      phoneNumber: phoneNumber.trim(),
      birthDate: birthDate.trim(),
      avatarFile: avatarPreview?.file,
    });
  };

  // 이미지 삭제 핸들러
  const handleAvatarRemove = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview.previewUrl);
      setAvatarPreview(null);
    }
  };

  const isValid = profileName.trim() && phoneNumber.trim() && birthDate.trim();
  const isDisabled = !isValid || isSubmitting || isCompressing;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              src={avatarPreview?.previewUrl || defaultAvatar}
              alt="프로필 이미지"
              className="size-20 rounded-full border object-cover"
            />
            {isCompressing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="size-6 animate-spin text-white" />
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
              className="absolute right-0 bottom-0 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <div className="bg-primary text-primary-foreground pointer-events-none absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-white">
              <Camera className="size-3.5" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">
          이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="profile-name"
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone-number">
          연락처 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone-number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="010-0000-0000"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="birth-date">
          생일 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="birth-date"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-2 w-full"
        onClick={handleSubmit}
        disabled={isDisabled}
      >
        {isSubmitting ? "저장 중..." : "다음"}
        {!isSubmitting && <ArrowRight className="ml-1 size-4" />}
      </Button>
    </div>
  );
}
