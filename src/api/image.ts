import { BUCKET_NAME, STORAGE_PATHS } from "@/lib/constants";
import supabase from "@/lib/supabase";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  // 1. 파일 업로드
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  // 2. 파일 업로드 URL 반환
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

// 개별 이미지 삭제
export async function deleteImage(filePath: string) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) throw error;
}

// 특정 경로의 모든 이미지 삭제
export async function deleteAllImagesInFolder(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);

  // 파일이 없으면 종료
  if (!files || files.length === 0) return;

  // 파일 목록 조회 실패 시 오류 발생
  if (fetchFilesError) throw fetchFilesError;

  // 파일 삭제
  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}
