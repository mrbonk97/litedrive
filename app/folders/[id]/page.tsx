import { getFolderById } from "@/actions/folder-action-server";
import { FolderCrumb } from "@/components/folder-crumb";
import { BottomNav } from "@/components/nav/bottom-nav";
import { Leftnav } from "@/components/nav/left-nav";
import { Topnav } from "@/components/nav/top-nav";
import { FolderTable } from "@/components/table/folder-table";
import { FolderProvider } from "@/context/folder-context";
import { Squirrel } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string | null }>;
  searchParams: Promise<{
    q?: string;
    filter?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { breadCrumb } = await getFolderById(id, undefined, undefined);

  if (breadCrumb.length > 0) {
    return { title: `${breadCrumb[breadCrumb.length - 1].name} - LiteDrive` };
  }

  return { title: `폴더 - LiteDrive` };
}

async function FoldersIdPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { q, filter } = await searchParams;
  const { files, folders, breadCrumb } = await getFolderById(id, q, filter);

  return (
    <>
      <Topnav />
      <Leftnav folderId={id} filter={filter} />
      <main className="lg:pl-64 pt-14 min-h-full">
        <FolderProvider>
          <section className="p-4 border-b">
            <FolderCrumb breadCrumb={breadCrumb} />
          </section>
          <FolderTable files={files} folders={folders} />
        </FolderProvider>
        {files.length === 0 && folders.length === 0 && (
          <div className="mt-4 p-4 text-rose-400">
            <Squirrel className="mx-auto" size={48} />
            <p className="mt-2 text-center">파일이 없습니다.</p>
          </div>
        )}
      </main>
      <BottomNav folderId={id} />
    </>
  );
}

export default FoldersIdPage;
