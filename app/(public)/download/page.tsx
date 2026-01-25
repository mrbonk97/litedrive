import { DownloadShareFileForm } from "@/components/form/download-share-file-form";
import { Logo } from "@/components/nav/logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "다운로드 - LiteDrive",
};

interface Props {
  searchParams: Promise<{ code?: string }>;
}

async function DownloadPage({ searchParams }: Props) {
  const { code } = await searchParams;

  return (
    <main className="p-4 pb-16 min-h-screen h-full bg-rose-200 flex items-center justify-center">
      <h1 className="sr-only">공유 파일 다운로드</h1>
      <div className="mx-auto p-8 max-w-md rounded-md w-full bg-background">
        <Logo className="w-fit mx-auto" />
        <DownloadShareFileForm defaultCode={code} />
      </div>
    </main>
  );
}

export default DownloadPage;
