import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { useNavigate } from "react-router";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { mutate: updatePassword, isPending: isUpdatingPasswordPending } =
    useUpdatePassword({
      onSuccess: () => {
        toast.success("비밀번호가 성공적으로 변경되었습니다.", {
          position: "top-center",
        });
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.message, { position: "top-center" });
        setPassword("");
        setConfirmPassword("");
      },
    });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim() === "") return;
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.", {
        position: "top-center",
      });
      return;
    }

    updatePassword({ password });
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="my-(--footer-height) flex w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">새 비밀번호 설정</CardTitle>
          <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">새 비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="최소 6자 이상"
                  disabled={isUpdatingPasswordPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  disabled={isUpdatingPasswordPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdatingPasswordPending}
              >
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
