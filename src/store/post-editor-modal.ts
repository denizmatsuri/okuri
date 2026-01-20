import { combine, devtools } from "zustand/middleware";
import { create } from "zustand";

type PostData = {
  postId: number;
  content: string;
  imageUrls: string[] | null;
  isNotice: boolean;
}

type ModalType = "CREATE" | "EDIT";

const initialState = {
  isOpen: false,
  type: "CREATE" as ModalType,
  postData: null as PostData | null, // 수정 모드 시 게시글 정보
};

const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => set({ isOpen: true, type: "CREATE" }),
        openEdit: (postData: PostData) => set({ isOpen: true, type: "EDIT", postData }),
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
export const useOpenCreatePostEditorModal = () => {
  const openCreate = usePostEditorModalStore((store) => store.actions.openCreate);
  return openCreate;
};

/**
 * 게시글 수정 모달 열기
 */
export const useOpenEditPostEditorModal = () => {
  const openEdit = usePostEditorModalStore((store) => store.actions.openEdit);
  return openEdit;
};