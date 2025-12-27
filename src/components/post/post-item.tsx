import defaultAvatar from "@/assets/default-avatar.jpg";
import { Link } from "react-router";

export default function PostItem() {
  return (
    <div className="flex flex-col gap-2 border-b p-4">
      {/* 게시글 작성자 정보 */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <img
              src={defaultAvatar}
              alt="avatar"
              className="h-14 rounded-full border"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <Link to="/profile" className="text-lg font-medium">
              김희수
            </Link>
            <div className="text-muted-foreground text-sm">1시간 전</div>
          </div>
        </div>
      </div>
      {/* 게시글 내용 */}
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">안녕하세요. 김희수입니다.</div>
        {/* FIXME: 이미지 슬라이더, shadcn/ui의 Carousel 컴포넌트 사용 */}
      </div>
    </div>
  );
}
