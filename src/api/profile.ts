import { STORAGE_PATHS } from "@/lib/constants";
import supabase from "@/lib/supabase";
import { deleteAllImagesInFolder, uploadImage } from "./image";

// FIXME: fetchProfile 함수명으로 변경
export async function getUserProfileData(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// 프로필 업데이트
export async function updateUserProfile({
  userId,
  display_name,
  phone_number,
  birth_date,
  avatarImageFile,
}: {
  userId: string;
  display_name: string;
  phone_number?: string;
  birth_date?: string;
  avatarImageFile?: File | null;
}) {
  // 1. 새 프로필 이미지 업로드 (파일이 있을 때만)
  let newAvatarImageUrl: string | undefined;
  if (avatarImageFile) {
    // 기존 프로필 이미지 삭제
    const basePath = STORAGE_PATHS.userAvatar(userId);
    await deleteAllImagesInFolder(basePath);

    // 새 이미지 업로드
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp";
    const filePath = `${basePath}/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await uploadImage({
      file: avatarImageFile,
      filePath,
    });
  }

  // 2. 유저 프로필 데이터 업데이트
  const { data, error } = await supabase
    .from("users")
    .update({
      display_name,
      phone_number,
      birth_date,
      avatar_url: newAvatarImageUrl,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
