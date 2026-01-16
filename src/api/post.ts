import { uploadImage } from "@/api/image";
import type { FamilyMember, Post, PostEntity } from "@/types";
import supabase from "@/utils/supabase";

/**
 * 가족 게시글 목록 조회
 *
 * // NOTE: 기술적 의사결정:
 * - posts → family_members FK 조인 불가 (unique 제약 미충족)
 * - Batch 쿼리 2회로 해결 (N+1 방지)
 * - 확장 필요 시 DB View 또는 RPC 함수로 전환 가능(현재 MVP 수준에서는 충분함)
 */
export async function fetchPosts(familyId: string) {
  // 1. 게시글 목록 조회
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!posts?.length) return [];

  // 2. 작성자들의 가족 내 프로필(family_members) 조회
  // - posts.author_id는 users.id를 참조
  // - 해당 유저의 family_members 정보를 별도로 가져옴
  const authorIds = [...new Set(posts.map((p) => p.author_id))];

  const { data: members, error: memberError } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId)
    .in("user_id", authorIds);

  if (memberError) throw memberError;

  // 3. 수동 조인: posts + family_members 조합
  const memberMap = new Map(members?.map((m) => [m.user_id, m]));

  return posts.map((post) => ({
    ...post,
    familyMember: memberMap.get(post.author_id) as FamilyMember,
  })) as Post[];
}

/**
 * 단일 게시글 상세 조회
 */
export async function fetchPostById(postId: number) {
  // 1. 게시글 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) throw error;
  if (!post) return null;

  // 2. 작성자의 가족 내 프로필 조회
  const { data: familyMember, error: memberError } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", post.family_id)
    .eq("user_id", post.author_id)
    .single();

  if (memberError && memberError.code !== "PGRST116") {
    // PGRST116: 결과 없음 (멤버가 탈퇴한 경우 등)
    throw memberError;
  }

  return {
    ...post,
    familyMember: familyMember as FamilyMember,
  } as Post;
}

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
