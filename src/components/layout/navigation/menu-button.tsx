import { signOut } from "@/api/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useOpenAlertModal } from "@/store/alert-modal";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, ChevronRight, Menu } from "lucide-react";
import { useSetTheme, useTheme } from "@/store/theme";
import type { Theme } from "@/types";

const THEMES: Theme[] = ["system", "dark", "light"];

export default function MenuButton() {
  const openAlertModal = useOpenAlertModal();
  const queryClient = useQueryClient();
  const currentTheme = useTheme();
  const setTheme = useSetTheme();

  const handleSignOut = () => {
    openAlertModal({
      title: "로그아웃",
      description: "정말 로그아웃하시겠습니까?",
      onPositive: async () => {
        await signOut();
        queryClient.clear();
      },
    });
  };
  return (
    <Popover>
      <PopoverTrigger>
        <div className="hover:bg-muted flex cursor-pointer justify-end rounded-full p-2">
          <Menu className="text-muted-foreground h-7 w-7" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="m-2 w-40 p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start rounded-2xl py-3"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-muted-foreground">디자인</span>
                <ChevronRight className="text-muted-foreground h-4 w-4" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="m-2 w-40 p-2" side="right">
            {THEMES.map((theme) => (
              <PopoverClose key={`theme-button-${theme}`} asChild>
                <div
                  onClick={() => setTheme(theme)}
                  className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3"
                >
                  {theme}
                  {currentTheme === theme && <CheckIcon className="h-4 w-4" />}
                </div>
              </PopoverClose>
            ))}
          </PopoverContent>
        </Popover>
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
