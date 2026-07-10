import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js 16",
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
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LiteDrive - 개인정보 없이 쓰는 가벼운 파일 드라이브",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "mrbonk97",
    images: ["/og-image.jpg"],
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko" className="antialiased">
      <body className={`${pretendard.className}`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
