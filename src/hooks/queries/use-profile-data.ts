import { getUserProfileData } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useUserProfileData(userId?: string) {
  return useQuery({
    // queryKey: ["userProfile", userId],
    queryKey: QUERY_KEYS.userProfile.byId(userId!),
    // queryFn: async () => { await getUserProfileData(userId!); },
    queryFn: async () => {
      const userProfileData = await getUserProfileData(userId!);
      return userProfileData;
    },
    enabled: !!userId,
  });
}
