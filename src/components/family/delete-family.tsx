import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteFamily } from "@/hooks/mutations/family/use-delete-family";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useNavigate } from "react-router";

export default function DeleteFamily({
  familyId,
  familyName,
  userId,
}: {
  familyId: string;
  familyName: string;
  userId: string;
}) {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const deleteFamilyMutation = useDeleteFamily({
    onSuccess: () => {
      toast.success("가족이 삭제되었습니다", { position: "top-center" });
      navigate(`/profile/${userId}`);
    },
    onError: (error) => {
      toast.error(error.message || "가족 삭제에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  const handleDeleteFamily = () => {
    openAlertModal({
      title: "정말 가족을 삭제하시겠습니까?",
      description: `${familyName}을(를) 가족 삭제시 모든 멤버가 자동으로 제거되고, 관련된 모든 데이터(게시물, 사진 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`,
      onPositive: () => {
        deleteFamilyMutation.mutate({ familyId, userId });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-destructive font-medium">가족 삭제</h2>
      <p className="text-muted-foreground text-sm">
        가족을 삭제하면 모든 멤버가 가족에서 제거되고, 관련된 모든 데이터가
        영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
      </p>

      <Button
        variant="destructive"
        className="w-full"
        onClick={handleDeleteFamily}
        disabled={deleteFamilyMutation.isPending}
      >
        가족 삭제
      </Button>
    </div>
  );
}
