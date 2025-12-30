import { type Database } from "@/database.types";

export type TodoEntity = Database["public"]["Tables"]["todos"]["Row"];
export type UserEntity = Database["public"]["Tables"]["users"]["Row"];

/**
 * React Query useMutation 훅의 콜백 타입
 *
 * 커스텀 mutation 훅에서 생명주기 콜백을 외부 주입받아
 * 컴포넌트별로 다른 후처리 로직을 적용할 수 있게 합니다.
 */
export type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
