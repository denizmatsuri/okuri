import { cn } from "@/lib/utils";
import type { PostCategory } from "@/types";

type CategoryFilterProps = {
  category: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
  noticeCount: number;
};

const categories: { value: PostCategory; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "general", label: "게시글" },
  { value: "notice", label: "공지사항" },
];

export default function CategoryFilter({
  category,
  onCategoryChange,
  noticeCount,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-2">
      {categories.map(({ value, label }) => {
        const isActive = category === value;
        const showBadge = value === "notice" && noticeCount > 0;

        return (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            className={cn(
              "flex items-center gap-1.5 py-1 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground border-b-2"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            {showBadge && (
              <span className="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs">
                {noticeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
