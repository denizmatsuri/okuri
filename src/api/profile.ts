import supabase from "@/utils/supabase";

export async function getUserProfileData(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// 현재 Supabase trigger 함수를 사용하여 프로필 생성 로직 사용안함
// export async function createUserData(userId: string) {
//   // FIXME: 프로필 생성 시 필요한 필드 추가
//   const { data, error } = await supabase
//     .from("users")
//     .insert({
//       id: userId,
//       email: "test@test.com",
//       display_name: "test",
//       avatar_url: "https://example.com/avatar.png",
//       birth_date: "2000-01-01",
//       phone_number: "",
//       notification_enabled: true,
//     })
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }
