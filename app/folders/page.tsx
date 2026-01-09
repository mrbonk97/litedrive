import FoldersIdPage from "./[id]/page";

interface Props {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

function FoldersRootPage({ searchParams }: Props) {
  return FoldersIdPage({
    params: Promise.resolve({ id: null }),
    searchParams: searchParams,
  });
}

export default FoldersRootPage;
