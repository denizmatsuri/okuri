import { create } from "zustand";
import { devtools, combine } from "zustand/middleware";

type CloseState = {
  isOpen: false;
};

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State; // 타입 단언(타입 추론이 안 되는 경우)

export const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) =>
          set({ ...params, isOpen: true }),
        close: () => set({ isOpen: false }),
      },
    })),
    { name: "alertModalStore" },
  ),
);

export const useOpenAlertModal = () => {
  const open = useAlertModalStore((store) => store.actions.open);
  return open;
};

export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & State;
};
