import { cn } from "@/lib/utils";
import Link from "next/link";

const SERVICE_NAME = "Litedrive";
const COMPANY_NAME = "hypersoso";
const CONTACT_EMAIL = "privacy@hypersoso.com";

const links = [
  {
    label: "이용약관",
    href: "/policy",
  },
  {
    label: "개인정보처리방침",
    href: "/privacy",
  },
];

interface Props {
  className?: string;
}

export function Footer({ className }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-secondary">
      <div className={cn("p-4 mx-auto max-w-5xl", className)}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              {SERVICE_NAME}
            </Link>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              간편한 파일 업로드와 공유를 위한 서비스입니다.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              운영: {COMPANY_NAME}
            </p>
          </div>

          <nav aria-label="푸터 링크" className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            ))}

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              문의하기
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-4 text-sm text-muted-foreground lg:flex-row">
          <p>
            © {year} {COMPANY_NAME}. All rights reserved.
          </p>

          <p>{CONTACT_EMAIL}</p>
        </div>
      </div>
    </footer>
  );
}
