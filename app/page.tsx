import { Footer } from "@/components/footer";
import { LandingTopNav } from "@/features/navigation/ui/landing-top-nav";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { LandingSection1 } from "@/features/landing-page/ui/landing-section-1";
import { LandingSection2 } from "@/features/landing-page/ui/landing-section-2";
import { LandingSection3 } from "@/features/landing-page/ui/landing-section-3";
import { LandingSection4 } from "@/features/landing-page/ui/landing-section-4";
import { LandingSection5 } from "@/features/landing-page/ui/landing-section-5";
import { createClient } from "@/lib/supabase/server";
import { Variants, ViewportOptions } from "motion/react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "가벼운 파일 보관과 공유",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.64,
      ease: "easeOut",
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 48,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: "easeOut",
      when: "beforeChildren",
    },
  },
};

const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 48,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.48,
      ease: "easeOut",
    },
  },
};

const viewport: ViewportOptions = {
  once: true,
  margin: "-320px",
};

export default async function HomePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (user) {
    redirect("/folders");
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: getSiteUrl().toString(),
    description: SITE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <LandingTopNav />
      <main className="p-4 md:p-8 mx-auto max-w-7xl overflow-hidden">
        <LandingSection1 fadeUp={fadeUp} viewport={viewport} />
        <LandingSection2
          fadeUp={fadeUp}
          scaleIn={scaleIn}
          slideInRight={slideInRight}
          viewport={viewport}
        />
        <LandingSection3
          fadeUp={fadeUp}
          scaleIn={scaleIn}
          slideInRight={slideInRight}
          viewport={viewport}
        />
        <LandingSection4
          fadeUp={fadeUp}
          slideInRight={slideInRight}
          viewport={viewport}
        />
        <LandingSection5 fadeUp={fadeUp} viewport={viewport} />
      </main>
      <Footer className="lg:pt-16" />
    </>
  );
}
