import PostItem from "@/components/post/post-item";

export default function IndexPage() {
  return (
    <main className="mt-(--mobile-header-height) mb-(--mobile-nav-height) w-full flex-1 border-x md:m-0">
      <div className="flex items-center gap-4 border-b p-4">
        <span className="cursor-pointer border px-2 py-1 text-lg">게시글</span>
        <span className="flex cursor-pointer items-center gap-1 border px-2 py-1 text-lg">
          공지사항
          <span className="text-muted-foreground bg-muted px-2 py-1 text-sm">
            10
          </span>
        </span>
      </div>
      <div className="flex flex-col">
        {Array.from({ length: 10 }).map((_, index) => (
          <PostItem key={index} />
        ))}
      </div>
    </main>
  );
}
