import supabase from "@/utils/supabase";
import type { Comment } from "@/types";

export async function fetchComments({
  postId,
  familyId,
}: {
  postId: number;
  familyId: string;
}) {
  // 1. 댓글 목록 조회
  const { data: comments, error } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!comments?.length) return [];

  // 2. 작성자들의 family_members 조회 (batch)
  const authorIds = [...new Set(comments.map((c) => c.author_id))];

  const { data: members, error: memberError } = await supabase
    .from("family_members")
    .select("*, user:users(*)")
    .eq("family_id", familyId)
    .in("user_id", authorIds);

  if (memberError) throw memberError;

  // 3. 수동 조인
  const memberMap = new Map(members?.map((m) => [m.user_id, m]));

  return comments.map((comment) => ({
    ...comment,
    familyMember: memberMap.get(comment.author_id),
  })) as Comment[];
}

export async function createComment({
  postId,
  familyId,
  content,
  parentCommentId,
  rootCommentId,
}: {
  postId: number;
  familyId: string;
  content: string;
  parentCommentId?: number;
  rootCommentId?: number;
}) {
  const { data: comment, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      content,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId,
    })
    .select()
    .single();

  if (error) throw error;

  // 2. 작성자의 family_member 조회
  const { data: familyMember, error: memberError } = await supabase
    .from("family_members")
    .select("*, user:users(*)")
    .eq("family_id", familyId)
    .eq("user_id", comment.author_id)
    .single();

  if (memberError) throw memberError;

  // 3. 수동 조인
  return {
    ...comment,
    familyMember: {
      ...familyMember,
      user: familyMember.user,
    },
  } as Comment;
}

export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("post_comments")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment({ id }: { id: number }) {
  const { data, error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
