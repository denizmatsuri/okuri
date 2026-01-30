import { signOut } from "@/api/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useOpenAlertModal } from "@/store/alert-modal";
import { PopoverClose } from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  children: ReactNode;
};
export default function MenuButton({ children }: Props) {
  const openAlertModal = useOpenAlertModal();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    // alert-dialog 사용
    openAlertModal({
      title: "로그아웃",
      description: "정말 로그아웃하시겠습니까?",
      onPositive: async () => {
        await signOut();
        queryClient.clear();
      },
    });

    // navigate("/");
  };
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="ml-2 w-40 p-2">
        <PopoverClose asChild>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-destructive hover:text-destructive h-auto w-full justify-start rounded-xl py-3"
          >
            로그아웃
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
