import { getFolderById } from "@/client/api/folder.api.ssr";
import { FoldersClient } from "./_client";

interface Props {
  params: Promise<{ id: string | null }>;
  searchParams: Promise<{
    q: string | null;
    filter: string | null;
  }>;
}

async function FoldersPage({ searchParams }: Props) {
  const { q, filter } = await searchParams;
  const data = await getFolderById({ id: null, q, filter });

  return <FoldersClient initialData={data} id={null} q={q} filter={filter} />;
}

export default FoldersPage;
