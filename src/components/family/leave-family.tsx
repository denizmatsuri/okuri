import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLeaveFamily } from "@/hooks/mutations/family/use-leave-family";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function LeaveFamily({
  familyId,
  familyName,
  userId,
}: {
  familyId: string;
  familyName: string;
  userId: string;
}) {
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const leaveFamilyMutation = useLeaveFamily({
    onSuccess: () => {
      toast.success("가족을 나갔습니다", { position: "top-center" });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  const handleLeaveFamily = () => {
    openAlertModal({
      title: "정말 가족을 나가시겠습니까?",
      description: `${familyName}을(를) 나가면 더 이상 이 가족의 게시물과 사진에 접근할 수 없습니다. 다시 참여하려면 초대 코드가 필요합니다.`,
      onPositive: () => {
        leaveFamilyMutation.mutate({ familyId, userId });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-destructive font-medium">가족 나가기</h2>
      <p className="text-muted-foreground text-sm">
        가족을 나가면 더 이상 이 가족의 게시물과 사진에 접근할 수 없습니다. 다시
        참여하려면 초대 코드가 필요합니다.
      </p>

      <Button
        variant="destructive"
        className="w-full"
        onClick={handleLeaveFamily}
        disabled={leaveFamilyMutation.isPending}
      >
        가족 나가기
      </Button>
    </div>
  );
}
