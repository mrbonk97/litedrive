import { Metadata } from "next";
import FoldersIdPage from "./[id]/page";

interface Props {
  searchParams: Promise<{ q: string; filter: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, filter } = await searchParams;

  if (q) return { title: `${q} - LiteDrive` };

  if (filter && filter === "share") {
    return { title: `공유중인 파일 - LiteDrive` };
  }

  return { title: `홈 - LiteDrive` };
}

async function FolderHomePage({ searchParams }: Props) {
  return <FoldersIdPage params={Promise.resolve({ id: "0" })} searchParams={searchParams} />;
}

export default FolderHomePage;
