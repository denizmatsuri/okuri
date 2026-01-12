import { Link } from "react-router";
import { Home, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoFamilyPage() {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* 아이콘 영역 */}
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Home className="text-primary size-8" />
          </div>
          <CardTitle className="text-2xl">가족과 함께 시작하세요</CardTitle>
          <CardDescription className="text-balance">
            가족 그룹을 만들거나 초대 코드로 가입하여 소중한 순간을 함께
            기록해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link to="/family/create">
              <Home />새 가족 만들기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/family/join">
              <UserPlus />
              초대 코드로 가입하기
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
