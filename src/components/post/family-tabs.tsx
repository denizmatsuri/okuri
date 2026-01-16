import { cn } from "@/lib/utils";

type FamilyTabsProps = {
  families: Array<{ id: string; name: string }>;
  currentFamilyId: string | null;
  onFamilyChange: (familyId: string) => void;
};

export default function FamilyTabs({
  families,
  currentFamilyId,
  onFamilyChange,
}: FamilyTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b px-4 py-3">
      {families.map((family) => {
        const isActive = family.id === currentFamilyId;

        return (
          <button
            key={family.id}
            onClick={() => onFamilyChange(family.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {family.name}
          </button>
        );
      })}
    </div>
  );
}
