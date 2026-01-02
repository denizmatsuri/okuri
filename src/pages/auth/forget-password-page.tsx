import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSendResetPasswordEmail } from "@/hooks/mutations/auth/use-send-reset-password-email";
import { generateErrorMessage } from "@/lib/error-messages";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");

  const {
    mutate: sendResetPasswordEmail,
    isPending: isSendingResetPasswordEmailPending,
  } = useSendResetPasswordEmail({
    onSuccess: () => {
      toast.success("비밀번호 재설정 이메일을 보냈습니다.", {
        position: "top-center",
      });
      setEmail("");
    },
    onError: (error) => {
      toast.error(generateErrorMessage(error), {
        position: "top-center",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("이메일을 입력해주세요.", {
        position: "top-center",
      });
      return;
    }
    sendResetPasswordEmail({ email });
  };
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="my-(--footer-height) flex w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">비밀번호 재설정</CardTitle>
          <CardDescription>
            이메일을 입력하여 비밀번호를 재설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  disabled={isSendingResetPasswordEmailPending}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSendingResetPasswordEmailPending}
              >
                비밀번호 재설정
              </Button>
            </div>
          </form>
          <div className="bg-border my-4 h-px w-full" />
          <div className="text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <Link to="/sign-in" className="underline underline-offset-4">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
