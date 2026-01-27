import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/store/session";
import { useFamiliesWithMembers } from "@/hooks/queries/use-family-data";
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
    return <Loader />;
  }

  if (!family || !userId) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">접근 권한이 없습니다</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) w-full flex-1 border-x md:m-0">
      {/* 헤더 */}
      <div className="flex items-center gap-2 border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">가족 관리</h1>
      </div>

      <div className="flex flex-col gap-6 p-4">
        <FamilyInfo
          familyId={family.id}
          initialName={family.name}
          initialDescription={family.description}
          isAdmin={isAdmin}
        />

        <hr />

        <MemberList
          familyId={family.id}
          members={family.members}
          currentUserId={userId}
          isAdmin={isAdmin}
        />

        <hr />

        <LeaveFamily
          familyId={family.id}
          familyName={family.name}
          userId={userId}
        />

        <hr />

        {isAdmin && (
          <DeleteFamily
            familyId={family.id}
            familyName={family.name}
            userId={userId}
          />
        )}
      </div>
    </main>
  );
}
