import supabase from "@/lib/supabase";
import type { Comment } from "@/types";

export async function fetchComments({ postId }: { postId: number }) {
  const { data: comments, error } = await supabase
    .from("post_comments")
    .select(
      `
      *,
      familyMember: family_members!family_member_id (
        *,
        user: users (*)
      )
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!comments?.length) return [];

  return comments as Comment[];
}

export async function createComment({
  postId,
  familyMemberId,
  content,
  parentCommentId,
  rootCommentId,
}: {
  postId: number;
  familyMemberId: string;
  content: string;
  parentCommentId?: number;
  rootCommentId?: number;
}) {
  // 1. 댓글 생성
  const { data: comment, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      content,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId,
      family_member_id: familyMemberId,
    })
    .select(
      `
      *,
      familyMember: family_members!family_member_id (
        *,
        user: users (*)
      )
    `,
    )
    .single();

  if (error) throw error;

  return comment as Comment;
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
