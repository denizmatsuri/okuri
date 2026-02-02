import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/store/session";
import { useFamiliesWithMembers } from "@/hooks/queries/use-families-with-members";
import Loader from "@/components/loader";
import FamilyInfo from "@/components/family/family-info";
import MemberList from "@/components/family/member-list";
import LeaveFamily from "@/components/family/leave-family";
import DeleteFamily from "@/components/family/delete-family";

export default function FamilySettingPage() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const userId = session?.user.id;

  const { data: families = [], isLoading } = useFamiliesWithMembers(userId);
  const family = families.find((f) => f.id === familyId);

  // 현재 사용자가 Admin인지 확인
  const currentMember = family?.members.find((m) => m.user_id === userId);
  const isAdmin = currentMember?.is_admin ?? false;

  if (isLoading) {
    return (
      <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 items-center justify-center md:m-0 md:bg-transparent">
        <Loader />
      </main>
    );
  }

  if (!family || !userId) {
    return (
      <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 items-center justify-center md:m-0 md:bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">접근 권한이 없습니다</p>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background mt-(--mobile-header-height) mb-(--mobile-nav-height) flex min-h-screen w-full flex-1 flex-col md:m-0 md:bg-transparent">
      {/* 헤더 */}
      <div className="flex h-15 items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-medium">가족 관리</h1>
      </div>

      <div className="md:bg-background flex flex-1 flex-col gap-8 border-b-0 p-4 md:rounded-t-4xl md:border">
        <section>
          <FamilyInfo
            familyId={family.id}
            initialName={family.name}
            initialDescription={family.description}
            isAdmin={isAdmin}
          />
        </section>

        <section>
          <MemberList
            familyId={family.id}
            members={family.members}
            currentUserId={userId}
            isAdmin={isAdmin}
          />
        </section>

        <section className="mt-auto pt-8">
          <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-4">
            <h2 className="mb-4 text-sm font-semibold text-destructive">
              위험 구역
            </h2>
            <div className="flex flex-col gap-6">
              {family.members.length > 1 && (
                <LeaveFamily
                  familyId={family.id}
                  familyName={family.name}
                  userId={userId}
                />
              )}

              {isAdmin && (
                <DeleteFamily
                  familyId={family.id}
                  familyName={family.name}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
