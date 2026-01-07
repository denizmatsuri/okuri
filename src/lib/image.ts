import imageCompression from "browser-image-compression";

export type ImagePreset = "avatar" | "post" | "gallery";

/**
 * 용도별 이미지 압축 설정
 * - maxSizeMB 초과 시 해당 크기로 압축
 */
const IMAGE_PRESETS: Record<
  ImagePreset,
  { maxSizeMB: number; maxWidthOrHeight: number }
> = {
  avatar: { maxSizeMB: 3, maxWidthOrHeight: 1920 },
  post: { maxSizeMB: 5, maxWidthOrHeight: 1920 },
  gallery: { maxSizeMB: 5, maxWidthOrHeight: 1920 },
};

/**
 * 이미지 파일이 프리셋 기준을 초과하면 자동으로 압축합니다.
 * @param file - 압축할 이미지 파일
 * @param preset - 압축 프리셋 (기본값: "post")
 * @returns 압축된 파일 또는 원본 파일
 */
export async function compressImageIfNeeded(
  file: File,
  preset: ImagePreset = "post",
): Promise<File> {
  const { maxSizeMB, maxWidthOrHeight } = IMAGE_PRESETS[preset];
  const maxSize = maxSizeMB * 1024 * 1024;

  // 기준 이하면 압축 불필요
  if (file.size <= maxSize) {
    return file;
  }

  return await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  });
}
