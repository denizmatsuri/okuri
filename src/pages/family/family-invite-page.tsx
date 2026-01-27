import { useParams } from "react-router";
import { Copy, RefreshCw, Share2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useFamilyById,
  useMyFamiliesWithMembers,
} from "@/hooks/queries/use-family-data";
import { useSession } from "@/store/session";
import { useRegenerateInviteCode } from "@/hooks/mutations/family/use-regenerate-invite-code";
import Loader from "@/components/loader";

export default function FamilyInvitePage() {
  const { familyId } = useParams();
  const session = useSession();

  // 가족 정보 조회
  const { data: family, isLoading: isFamilyLoading } = useFamilyById(familyId);

  // 현재 사용자의 멤버십 정보 (관리자 여부 확인용)
  const { data: families } = useMyFamiliesWithMembers(session?.user.id);
  const membership = families?.find((f) => f.family?.id === familyId);
  const isAdmin = membership?.is_admin ?? false;

  // 초대 코드 재생성 mutation
  const { mutate: regenerateInviteCode, isPending: isRegenerating } =
    useRegenerateInviteCode({
      onSuccess: () => {
        toast.success("새 초대 코드가 생성되었습니다", {
          position: "top-center",
        });
      },
      onError: () => {
        toast.error("코드 재생성에 실패했습니다");
      },
    });

  // 클립보드 복사
  const handleCopy = async () => {
    if (!family?.invite_code) return;

    try {
      await navigator.clipboard.writeText(family.invite_code);
      toast.success("초대 코드가 복사되었습니다", { position: "top-center" });
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  // Web Share API (모바일 대응)
  const handleShare = async () => {
    if (!family?.invite_code || !navigator.share) return;

    try {
      // TODO: 공유 전용 URL 구현(현재는 초대 코드만 공유)
      await navigator.share({
        title: `${family.name} 가족 초대`,
        text: `우리 가족에 함께해요!\n초대 코드: ${family.invite_code}`,
      });
    } catch (error) {
      // 사용자가 공유를 취소한 경우 무시
      if ((error as Error).name !== "AbortError") {
        toast.error("공유에 실패했습니다");
      }
    }
  };

  const handleRegenerate = async () => {
    if (!familyId) return;
    regenerateInviteCode(familyId as string);
  };

  // 로딩 상태
  if (isFamilyLoading) {
    return <Loader />;
  }

  // 가족 정보 없음
  if (!family) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">
          가족 정보를 찾을 수 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* 헤더 */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-xl">가족 초대</CardTitle>
              <CardDescription>{family.name}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* 아이콘 + 안내 문구 */}
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Users className="text-primary size-8" />
            </div>
            <p className="text-muted-foreground text-sm text-balance">
              아래 초대 코드를 가족에게 공유하세요.
              <br />
              코드를 입력하면 가족에 참여할 수 있습니다.
            </p>
          </div>

          {/* 초대 코드 표시 */}
          <div className="bg-muted/50 rounded-xl border-2 border-dashed p-6 text-center">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
              초대 코드
            </p>
            <p className="font-mono text-3xl font-bold tracking-[0.3em]">
              {family.invite_code ?? "코드 없음"}
            </p>
          </div>

          {/* 복사 / 공유 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer"
              onClick={handleCopy}
              disabled={!family.invite_code}
            >
              <Copy className="size-4" />
              복사하기
            </Button>

            {/* Web Share API 지원 시에만 공유 버튼 표시 */}
            {"share" in navigator && (
              <Button
                size="lg"
                className="flex-1 cursor-pointer"
                onClick={handleShare}
                disabled={!family.invite_code}
              >
                <Share2 className="size-4" />
                공유하기
              </Button>
            )}
          </div>

          {/* 관리자 전용: 코드 재생성 */}
          {isAdmin && (
            <div className="border-t pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground w-full cursor-pointer"
                    disabled={isRegenerating}
                  >
                    <RefreshCw
                      className={`size-4 ${isRegenerating ? "animate-spin" : ""}`}
                    />
                    {isRegenerating ? "생성 중..." : "새 코드 생성"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      초대 코드를 재생성할까요?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      새 코드를 생성하면 기존 코드는 더 이상 사용할 수 없습니다.
                      이미 공유한 코드가 있다면 새 코드를 다시 공유해야 합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRegenerate}>
                      재생성
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
