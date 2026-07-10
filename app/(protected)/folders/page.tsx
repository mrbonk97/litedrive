import { FolderBreadcrumb } from "@/components/folder-bread-crumb";
import { DriveGrid } from "@/features/drive/ui/drive-grid";
import { DriveHeader } from "@/features/drive/ui/drive-header";
import { DriveEmpty } from "@/features/drive/ui/drive-empty";
import { DriveTable } from "@/features/drive/ui/drive-table";
import { getFiles } from "@/features/files/api/get-files.api";
import { getFolders } from "@/features/folders/api/get-folders.api";
import { createClient } from "@/lib/supabase/server";
import { Bot } from "lucide-react";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    q?: string;
    view?: "table" | "grid";
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q: _q } = await searchParams;
  const q = _q?.trim();

  return {
    title: q ? q : "폴더",
  };
}

export default async function FoldersHomePage({ searchParams }: Props) {
  const supabase = await createClient();

  const { q: _q, view: rawView } = await searchParams;
  const view = rawView === "grid" ? "grid" : "table";
  const q = _q?.trim();

  const sp = new URLSearchParams();
  if (view) sp.set("view", view);
  if (q) sp.set("q", q);

  const folders = await getFolders(supabase, null, q);
  const files = await getFiles(supabase, null, q);
  const isSearching = Boolean(q);
  const resultCount = folders.length + files.length;

  if (isSearching && resultCount === 0) {
    return (
      <main className="lg:pl-64 pt-14">
        <DriveHeader
          count={folders.length + files.length}
          curView={view}
          sp={sp}
        />
        <section className="p-8 text-center text-sm text-muted-foreground">
          <Bot size={48} className="mx-auto" />
          <p className="mt-4">검색 결과가 없습니다.</p>
        </section>
      </main>
    );
  }

  if (isSearching && resultCount > 0) {
    return (
      <main className="lg:pl-64 pt-14">
        <DriveHeader
          count={folders.length + files.length}
          curView={view}
          sp={sp}
        />
        <p className="p-4 text-2xl font-semibold border-b">
          {q}: 검색결과:{" "}
          {(folders.length + files.length).toLocaleString("ko-KR")}건
        </p>
        {view === "grid" ? (
          <DriveGrid files={files} folders={folders} />
        ) : (
          <DriveTable files={files} folders={folders} />
        )}
      </main>
    );
  }

  return (
    <main className="lg:pl-64 pt-14">
      <FolderBreadcrumb breadcrumb={[]} />
      <DriveHeader
        count={folders.length + files.length}
        curView={view}
        sp={sp}
      />
      {resultCount === 0 ? (
        <DriveEmpty />
      ) : view === "grid" ? (
        <DriveGrid files={files} folders={folders} />
      ) : (
        <DriveTable files={files} folders={folders} />
      )}
    </main>
  );
}
