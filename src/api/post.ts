import { uploadImage } from "@/api/image";
import type { PostEntity } from "@/types";
import supabase from "@/utils/supabase";

export async function createPost({
  familyId,
  content,
  isNotice,
}: {
  familyId: string;
  content: string;
  isNotice?: boolean;
}) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      family_id: familyId,
      content,
      is_notice: isNotice,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * 이미지 포함 게시글 생성
 * 1. 이미지 업로드
 * 2. 게시글 생성 (업로드된 이미지 URL 포함)
 */
export async function createPostWithImages({
  familyId,
  content,
  images,
  isNotice,
  userId,
}: {
  familyId: string;
  content: string;
  images: File[];
  isNotice?: boolean;
  userId: string;
}) {
  // 1. 게시글 생성
  const post = await createPost({ familyId, content, isNotice });
  if (images.length === 0) return post;

  try {
    // 2. 이미지 업로드 (병렬 처리)
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `families/${familyId}/posts/${userId}/${post.id}/${fileName}`;

        return uploadImage({ file: image, filePath });
      }),
    );

    // 3. 이미지 URL 업데이트(post 테이블에 업데이트)
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });
    return updatedPost;
  } catch (error) {
    // 에러시 게시글 삭제
    await deletePost(post.id);
    throw error;
  }
}

export async function deletePost(postId: number) {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
