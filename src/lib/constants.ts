export const QUERY_KEYS = {
  userProfile: {
    all: ["userProfile"],
    list: ["userProfile", "list"],
    byId: (userId: string) => ["userProfile", userId],
  },
};
