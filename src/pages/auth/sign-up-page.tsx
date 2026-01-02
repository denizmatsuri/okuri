import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { toast } from "sonner";
import { generateErrorMessage } from "@/lib/error-messages";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const { mutate: signUp, isPending: isSigningUpPending } = useSignUp({
    onSuccess: () => {
      toast.success("회원가입 성공", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(generateErrorMessage(error), { position: "top-center" });
    },
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast.error("비밀번호가 일치하지 않습니다.", { position: "top-center" });
      return;
    }

    signUp({ email, password });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="my-(--footer-height) flex w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            새 계정을 만들기 위해 정보를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  disabled={isSigningUpPending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  disabled={isSigningUpPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">비밀번호 확인</Label>
                <Input
                  id="repeat-password"
                  disabled={isSigningUpPending}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSigningUpPending}
              >
                {isSigningUpPending ? "가입 중..." : "회원가입"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link to="/sign-in" className="underline underline-offset-4">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
