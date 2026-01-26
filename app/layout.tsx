import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import { TanstackProvider } from "@/context/tanstack-provider";
import { ThemeProvider } from "@/context/theme-provider";

export const metadata: Metadata = {
  title: "LiteDrive",
  description:
    "LiteDrive, 최소한의 보안으로 최대한의 속도. 파일만을 위한 가장 단순한 공유 플랫폼.",
  applicationName: "LiteDrive",
  generator: "Next.js 15",
  keywords: [
    "LiteDrive",
    "파일 공유",
    "대용량 전송",
    "안전한 파일 전송",
    "클라우드 저장소",
    "파일 업로드",
    "파일 다운로드",
    "보안 파일 공유",
  ],
  authors: [{ name: "mrbonk97", url: process.env.NEXT_PUBLIC_BASE_URL }],
  creator: "LiteDrive",
  publisher: "LiteDrive",
  openGraph: {
    title: "LiteDrive",
    description:
      "LiteDrive, 최소한의 보안으로 최대한의 속도. 파일만을 위한 가장 단순한 공유 플랫폼.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "LiteDrive",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/static/og-image.png`,
        width: 1200,
        height: 630,
        alt: "LiteDrive - 쉽고 안전한 파일 공유",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LiteDrive",
    description:
      "LiteDrive, 최소한의 보안으로 최대한의 속도. 파일만을 위한 가장 단순한 공유 플랫폼.",
    creator: "mrbonk97",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/static/og-image.png`],
  },
};

interface Props {
  children: React.ReactNode;
}
function RootLayout({ children }: Props) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <TanstackProvider>{children}</TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
