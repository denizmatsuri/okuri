import type { PostCategory } from "@/types";
import { Button } from "../ui/button";

type CategoryFilterProps = {
  category: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
  // noticeCount: number;
};

const categories: { value: PostCategory; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "general", label: "게시글" },
  { value: "notice", label: "공지사항" },
];

export default function CategoryFilter({
  category,
  onCategoryChange,
  // noticeCount,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1 p-4">
      {categories.map(({ value, label }) => {
        const isActive = category === value;
        // const showBadge = value === "notice" && noticeCount > 0;

        return (
          <Button
            key={value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className="rounded-4xl border"
            onClick={() => onCategoryChange(value)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
