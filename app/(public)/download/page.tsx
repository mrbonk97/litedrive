import { Metadata } from "next";
import { Logo } from "@/components/logo";
import { ShareTokenForm } from "@/features/share/ui/share-token-form";

interface Props {
  searchParams: Promise<{
    code?: string;
  }>;
}

export const metadata: Metadata = {
  title: "다운로드",
  description: "LiteDrive 공유 코드로 전달받은 파일을 확인하고 다운로드하세요.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default async function DownloadPage({ searchParams }: Props) {
  const { code: _code } = await searchParams;
  const code = _code?.trim();

  return (
    <main className="p-4 sm:p-8 min-h-svh flex flex-col sm:items-center sm:justify-center sm:bg-rose-50">
      <section className="mx-auto sm:mb-32 max-w-md w-full">
        <Logo className="mr-auto w-fit" />
        <ShareTokenForm defaultCode={code} />
      </section>
    </main>
  );
}
