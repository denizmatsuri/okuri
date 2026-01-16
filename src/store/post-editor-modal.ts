import { combine, devtools } from "zustand/middleware";
import { create } from "zustand";

const initialState = {
  isOpen: false,
};

const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
      },
    })),
    { name: "postEditorModalStore" },
  ),
);

export const usePostEditorModal = () => usePostEditorModalStore();

/**
 * 게시글 작성 모달 열기
 */
export const useOpenPostEditorModal = () => {
  const open = usePostEditorModalStore((store) => store.actions.open);
  return open;
};
