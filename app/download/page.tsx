import { Metadata } from "next";
import { ShareFileCard } from "@/components/share-file-card";

export const metadata: Metadata = {
  title: "다운로드 - LiteDrive",
};

interface Props {
  searchParams: Promise<{ code?: string }>;
}

async function DownloadPage({ searchParams }: Props) {
  const { code } = await searchParams;

  return (
    <main className="p-4 min-h-screen h-full bg-rose-200 flex items-center justify-center">
      <h1 className="sr-only">공유 파일 다운로드</h1>
      <ShareFileCard code={code} />
    </main>
  );
}

export default DownloadPage;
