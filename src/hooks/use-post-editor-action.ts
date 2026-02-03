import { useNavigate } from "react-router";
import { useOpenCreatePostEditorModal } from "@/store/post-editor-modal";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useCurrentFamilyId } from "@/store/family";

export const usePostEditorAction = () => {
  const navigate = useNavigate();
  const currentFamilyId = useCurrentFamilyId();
  const openCreateModal = useOpenCreatePostEditorModal();
  const openAlertModal = useOpenAlertModal();

  const handleOpenCreateModal = () => {
    if (!currentFamilyId) {
      openAlertModal({
        title: "가족 연결이 필요합니다.",
        description:
          "게시글을 작성하려면 먼저 가족을 생성하거나 가입해야 합니다.",
        onPositive: () => navigate("/no-family"),
      });
      return;
    }
    openCreateModal();
  };

  return { handleOpenCreateModal };
};
