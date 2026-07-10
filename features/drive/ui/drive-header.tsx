import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2 } from "lucide-react";

interface Props {
  count: number;
  curFolderId?: string;
  curView: "table" | "grid";
  sp: URLSearchParams;
}

export function DriveHeader({ count, curFolderId, curView, sp }: Props) {
  const url = curFolderId ? `/folders/${curFolderId}` : "/folders";

  function createViewHref(nextView: "table" | "grid") {
    const params = new URLSearchParams(sp);
    params.set("view", nextView);
    return `${url}?${params.toString()}`;
  }

  return (
    <header className="p-2 bg-secondary flex items-center justify-between gap-2 border-b">
      <span className="text-sm">항목 {count.toLocaleString("ko-KR")}개</span>

      <div className="p-1 grid grid-cols-2 rounded-lg bg-background">
        <Button
          asChild
          size="icon-sm"
          aria-label="테이블 보기"
          variant={curView === "table" ? "default" : "ghost"}
          aria-pressed={curView === "table"}
        >
          <Link href={createViewHref("table")}>
            <Table2 size={16} />
          </Link>
        </Button>

        <Button
          asChild
          size="icon-sm"
          variant={curView === "grid" ? "default" : "ghost"}
          className={curView !== "grid" ? "text-muted-foreground" : undefined}
          aria-label="그리드 보기"
          aria-pressed={curView === "grid"}
        >
          <Link href={createViewHref("grid")}>
            <LayoutGrid size={16} />
          </Link>
        </Button>
      </div>
    </header>
  );
}
