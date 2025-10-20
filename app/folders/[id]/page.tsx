import { Metadata } from "next";
import { Topnav } from "@/components/nav/top-nav";
import { Leftnav } from "@/components/nav/left-nav";
import { safeAwait } from "@/lib/safe-await";
import { getFolderById } from "@/services/folder-server";
import { FolderProvider } from "@/context/folder-context";
import { BreadCrumb } from "@/components/folder-bread-crumb";
import { FolderTable } from "@/components/table/folder-table";
import { FileType } from "@/app/types";
import { BottomNav } from "@/components/nav/bottom-nav";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q: string; filter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const _id = parseInt(id);

  const [data] = await safeAwait(getFolderById(_id));

  if (data) {
    const len = data.breadCrumbs.length;
    return { title: `${data.breadCrumbs[len - 1].NAME} - LiteDrive` };
  }

  return { title: `폴더 - LiteDrive` };
}

async function FoldersIdPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { q, filter } = await searchParams;

  const _id = parseInt(id);
  if (isNaN(_id)) throw new Error("폴더 아이디는 숫자여야 합니다.");

  const { files, breadCrumbs } = await getFolderById(_id, q, filter);

  return (
    <>
      <Topnav />
      <Leftnav folderId={_id} />
      <main className="lg:pl-64 pt-14 min-h-full">
        <FolderProvider>
          <section className="p-4 border-b">
            <BreadCrumb folders={[_HOME_BREAD_CRUMB, ...breadCrumbs]} />
          </section>
          <FolderTable files={files} />
        </FolderProvider>
      </main>
      <BottomNav folderId={_id} />
    </>
  );
}

export default FoldersIdPage;

const _HOME_BREAD_CRUMB: FileType = {
  ID: 0,
  FOLDER_ID: 0,
  PARENT_FOLDER_ID: 0,
  NAME: "홈",
  USERNAME: "",
  SIZE_BYTES: 0,
  CONTENT: "",
  SHARE_CODE: null,
  FILE_TYPE: "FOLDER",
  UPDATED_AT: "",
  CREATED_AT: "",
};
