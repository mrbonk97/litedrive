import { FoldersClient } from "../_client";
import { getFolderById } from "@/client/api/folder.api.ssr";

interface Props {
  params: Promise<{ id: string | null }>;
  searchParams: Promise<{
    q: string | null;
    filter: string | null;
  }>;
}

async function FoldersPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { q, filter } = await searchParams;
  const data = await getFolderById({ id, q, filter });

  return <FoldersClient initialData={data} id={id} q={q} filter={filter} />;
}

export default FoldersPage;
