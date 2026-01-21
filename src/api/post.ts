import { deleteAllImagesInFolder, deleteImage, uploadImage } from "@/api/image";
import type { FamilyMember, Post, PostCategory, PostEntity } from "@/types";
import supabase from "@/utils/supabase";
import { PAGE_SIZE } from "@/hooks/queries/use-infinite-posts";
import { STORAGE_PATHS } from "@/lib/constants";

/**
 * 가족 게시글 목록 조회
 *
 * // NOTE: 기술적 의사결정:
 * - posts → family_members FK 조인 불가 (unique 제약 미충족)
 * - Batch 쿼리 2회로 해결 (N+1 방지)
 * - 확장 필요 시 DB View 또는 RPC 함수로 전환 가능(현재 MVP 수준에서는 충분함)
 * - cursor 기반 페이지네이션으로 데이터 일관성 보장
 */
export async function fetchPosts({
  userId,
  familyId,
  category,
  cursor,
  limit = PAGE_SIZE,
}: {
  userId: string;
  familyId: string;
  category?: PostCategory;
  cursor?: number;
  limit?: number;
}) {
  // 1. 게시글 목록 조회
  let query = supabase
    .from("posts")
    .select("*, myLiked: post_likes!post_id (*)")
    .eq("family_id", familyId)
    .eq("post_likes.user_id", userId) // 현재 사용자의 좋아요만
    .order("created_at", { ascending: false })
    .limit(limit);

  // 카테고리 필터
  if (category === "notice") {
    query = query.eq("is_notice", true);
  } else if (category === "general") {
    query = query.eq("is_notice", false);
  }
  // category가 "all" 또는 undefined면 필터 없음

  // 커서 기반 페이지네이션
  if (cursor) {
    query = query.lt("id", cursor);
  }

  const { data: posts, error } = await query;

  if (error) throw error;
  if (!posts?.length) return [];

  // 2. 작성자들의 가족 내 프로필(family_members) 조회
  const authorIds = [...new Set(posts.map((p) => p.author_id))];

  const { data: members, error: memberError } = await supabase
    .from("family_members")
    .select("*, user:users(*)")
    .eq("family_id", familyId)
    .in("user_id", authorIds);

  if (memberError) throw memberError;

  // 3. 수동 조인: posts + family_members 조합
  const memberMap = new Map(members?.map((m) => [m.user_id, m]));

  return posts.map((post) => ({
    ...post,
    familyMember: memberMap.get(post.author_id),
    isLiked: post.myLiked && post.myLiked.length > 0,
  })) as Post[];
}

/**
 * 단일 게시글 상세 조회
 */
export async function fetchPostById({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  // 1. 게시글 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select("*, myLiked: post_likes!post_id (*)")
    .eq("id", postId)
    .eq("post_likes.user_id", userId) // 현재 사용자의 좋아요만
    .single();

  if (error) throw error;
  if (!post) return null;

  // 2. 작성자의 가족 내 프로필 조회
  const { data: familyMember, error: memberError } = await supabase
    .from("family_members")
    .select("*, user:users(*)")
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
    isLiked: post.myLiked && post.myLiked.length > 0,
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
        const filePath = `${STORAGE_PATHS.postImages(familyId, userId, post.id.toString())}/${fileName}`;

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
    await deletePost(post);
    throw error;
  }
}

export async function deletePost(post: PostEntity) {
  // 1. 게시글 삭제
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post.id)
    .select()
    .single();

  // 2. 이미지 삭제
  const basePath = STORAGE_PATHS.postImages(
    post.family_id,
    post.author_id,
    post.id.toString(),
  );
  await deleteAllImagesInFolder(basePath);

  if (error) throw error;
  return data;
}

/**
 * 이미지 포함 게시글 수정
 * 1. 삭제된 이미지 스토리지에서 삭제
 * 2. 새 이미지 업로드
 * 3. 게시글 업데이트 (기존 URL + 새 URL)
 */
export async function updatePostWithImages({
  postId,
  familyId,
  userId,
  content,
  isNotice,
  existingImageUrls,
  deletedImageUrls,
  newImages,
}: {
  postId: number;
  familyId: string;
  userId: string;
  content: string;
  isNotice: boolean;
  existingImageUrls: string[];
  deletedImageUrls: string[];
  newImages: File[];
}) {
  const basePath = STORAGE_PATHS.postImages(
    familyId,
    userId,
    postId.toString(),
  );

  // 1. 삭제된 이미지 스토리지에서 삭제 (실패해도 계속 진행)
  await Promise.allSettled(
    deletedImageUrls.map((url) => {
      const fileName = url.split("/").pop();
      const filePath = `${basePath}/${fileName}`;
      return deleteImage(filePath);
    }),
  );

  // 2. 새 이미지 업로드
  let newImageUrls: string[] = [];
  if (newImages.length > 0) {
    newImageUrls = await Promise.all(
      newImages.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${basePath}/${fileName}`;
        return uploadImage({ file: image, filePath });
      }),
    );
  }

  // 3. 게시글 업데이트 (기존 URL + 새 URL)
  const finalImageUrls = [...existingImageUrls, ...newImageUrls];
  const updatedPost = await updatePost({
    id: postId,
    content,
    is_notice: isNotice,
    image_urls: finalImageUrls.length > 0 ? finalImageUrls : null,
  });

  return updatedPost;
}

/**
 * 게시글 좋아요 토글
 *
 * RPC 함수를 통해 동시성 제어와 함께 좋아요를 추가/제거합니다.
 *
 * **동작 과정:**
 * 1. FOR UPDATE로 posts 테이블의 행 잠금 (동시성 제어)
 * 2. post_likes 테이블에서 기존 좋아요 확인
 * 3. 없으면: like 추가, like_count 증가 → true 반환
 * 4. 있으면: like 삭제, like_count 감소 → false 반환
 *
 * @param postId - 좋아요할 게시글 ID
 * @param userId - 좋아요를 누르는 사용자 ID
 * @returns true: 좋아요 추가됨, false: 좋아요 제거됨
 * @throws 게시글이 존재하지 않을 경우 예외 발생
 */
export async function togglePostLike({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}
