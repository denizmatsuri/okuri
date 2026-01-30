import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateFamily } from "@/hooks/mutations/family/use-update-family";

export default function FamilyInfo({
  familyId,
  initialName,
  initialDescription,
  isAdmin,
}: {
  familyId: string;
  initialName: string;
  initialDescription: string | null;
  isAdmin: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");

  const updateFamilyMutation = useUpdateFamily({
    onSuccess: () => {
      toast.success("가족 정보가 수정되었습니다", { position: "top-center" });
    },
    onError: () => {
      toast.error("가족 정보 수정에 실패했습니다", { position: "top-center" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamilyMutation.mutate({
      familyId,
      name: name.trim(),
      description: description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">가족 정보</h2>
        <p className="text-muted-foreground text-sm">
          가족의 이름과 설명을 수정할 수 있습니다.
        </p>
      </div>

      <div className="bg-muted/30 flex flex-col gap-6 rounded-2xl border p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            가족 이름
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="가족 이름을 입력하세요"
            required
            disabled={!isAdmin}
            className="bg-background rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            설명 (선택)
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="가족에 대한 설명을 입력하세요"
            rows={3}
            disabled={!isAdmin}
            className="bg-background resize-none rounded-xl"
          />
        </div>

        {isAdmin && (
          <Button
            type="submit"
            disabled={updateFamilyMutation.isPending || !name.trim()}
            className="w-full rounded-xl"
          >
            {updateFamilyMutation.isPending ? "저장 중..." : "정보 저장"}
          </Button>
        )}
      </div>
    </form>
  );
}
