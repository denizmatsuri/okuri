import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function SubHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div className="flex h-auto w-full items-center gap-3 border-b px-4 pb-2 md:h-14 md:border-none md:pb-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="font-medium">{title}</h1>
    </div>
  );
}
