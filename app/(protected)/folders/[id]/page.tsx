import { createClient } from "@/lib/supabase/server";
import { getFiles } from "@/features/files/api/get-files.api";
import { getFolders } from "@/features/folders/api/get-folders.api";
import { getFolderBreadcrumb } from "@/features/folders/queries";
import { DriveHeader } from "@/features/drive/ui/drive-header";
import { DriveGrid } from "@/features/drive/ui/drive-grid";
import { DriveTable } from "@/features/drive/ui/drive-table";
import { FolderBreadcrumb } from "@/components/folder-bread-crumb";
import { DriveEmpty } from "@/features/drive/ui/drive-empty";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    view?: "table" | "grid";
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();

  const { id } = await params;

  const breadcrumb = await getFolderBreadcrumb(supabase, id);

  if (breadcrumb.length === 0) {
    notFound();
  }

  return {
    title: breadcrumb.at(-1)!.name,
  };
}

export default async function FoldersIdPage({ params, searchParams }: Props) {
  const supabase = await createClient();

  const { id } = await params;
  const { view: rawView } = await searchParams;
  const view = rawView === "grid" ? "grid" : "table";

  const files = await getFiles(supabase, id);
  const folders = await getFolders(supabase, id);
  const breadcrumb = await getFolderBreadcrumb(supabase, id);

  if (breadcrumb.length === 0) {
    notFound();
  }

  const count = folders.length + files.length;

  return (
    <main className="lg:pl-64 pt-14">
      <FolderBreadcrumb breadcrumb={breadcrumb} />
      <DriveHeader
        count={count}
        curFolderId={id}
        curView={view}
        sp={new URLSearchParams()}
      />
      {count == 0 && <DriveEmpty />}

      {count > 0 && view === "table" && (
        <DriveTable files={files} folders={folders} />
      )}

      {count > 0 && view === "grid" && (
        <DriveGrid files={files} folders={folders} />
      )}
    </main>
  );
}
