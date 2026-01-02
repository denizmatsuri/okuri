import { signOut } from "@/api/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function MenuButton({ children }: Props) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="m-2 flex w-40 flex-col p-0">
        <PopoverClose>
          <div
            onClick={signOut}
            className="hover:bg-muted text-destructive cursor-pointer px-4 py-3 text-sm"
          >
            로그아웃
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
