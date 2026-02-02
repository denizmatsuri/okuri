import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppliedTheme, useSetTheme, useTheme } from "@/store/theme";
import type { Theme } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";

const THEMES: Theme[] = ["system", "dark", "light"];

export default function ThemeButton() {
  const currentTheme = useTheme();
  const appliedTheme = useAppliedTheme();
  const setTheme = useSetTheme();

  // 현재 선택된 테마가 system이면 실제 적용된 테마를 기준으로, 아니면 선택된 테마를 기준으로 아이콘 표시
  const displayTheme = currentTheme === "system" ? appliedTheme : currentTheme;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="hover:bg-muted cursor-pointer rounded-full p-2">
          {displayTheme === "dark" ? (
            <MoonIcon className="text-muted-foreground h-7 w-7" />
          ) : (
            <SunIcon className="text-muted-foreground h-7 w-7" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="ml-2 w-40 p-2">
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
  );
}
