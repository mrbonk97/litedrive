import { Metadata } from "next";
import { Logo } from "@/components/nav/logo";
import { ShareCard } from "@/components/share-card";

export const metadata: Metadata = {
  title: "다운로드 - LiteDrive",
};

interface Props {
  searchParams: Promise<{ code: string }>;
}

async function DownloadPage({ searchParams }: Props) {
  const { code } = await searchParams;

  return (
    <main className="p-4 h-full bg-rose-200 flex items-center justify-center">
      <h1 className="sr-only">공유 파일 다운로드</h1>
      <div className="mb-40 w-full max-w-96">
        <Logo className="pb-8" />
        <ShareCard defaultCode={code} />
      </div>
    </main>
  );
}

export default DownloadPage;
