import PostEditorModal from "@/components/modal/post-editor-modal";
import { createPortal } from "react-dom";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {createPortal(
        <>
          <PostEditorModal />
          {/* 모달 추가 시 여기에 추가 */}
        </>,
        document.getElementById("modal-root")!, // index.html에 있는 modal-root 요소
      )}
      {children}
    </>
  );
}
