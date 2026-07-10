"use client";

import {
  ChevronRight,
  Link2,
  LucideIcon,
  UploadCloud,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { motion, stagger, Variants, ViewportOptions } from "motion/react";

const steps: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "회원가입",
    description: "필요한 정보만으로 빠르게 시작합니다.",
    icon: UserRoundCheck,
  },
  {
    title: "업로드",
    description: "파일을 선택하고 바로 보관합니다.",
    icon: UploadCloud,
  },
  {
    title: "다운로드 링크 공유",
    description: "코드 기반 공유로 간단하게 전달합니다.",
    icon: Link2,
  },
];

const sectionStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: stagger(0.24),
    },
  },
};

interface Props {
  fadeUp: Variants;
  scaleIn: Variants;
  slideInRight: Variants;
  viewport: ViewportOptions;
}

export function LandingSection2({
  fadeUp,
  scaleIn,
  slideInRight,
  viewport,
}: Props) {
  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mt-64 grid gap-8 lg:grid-cols-2"
    >
      <motion.hgroup variants={fadeUp}>
        <h2 className="text-3xl md:text-6xl font-bold leading-snug tracking-tight">
          파일 보관에 필요한
          <br />
          핵심만 남긴
          <br />
          드라이브
        </h2>

        <p className="mt-4 max-w-md text-muted-foreground break-keep text-balance">
          Litedrive는 불필요한 개인정보를 요구하지 않습니다. 복잡한 인증 절차
          없이, 필요한 순간 바로 파일을 업로드하고 보관할 수 있습니다.
        </p>

        <Link
          href="/sign-up"
          className="mt-2 md:mt-8 p-2 pl-4 rounded-lg bg-secondary text-secondary-foreground w-fit flex items-center gap-2 hover:bg-secondary/80 transition-colors"
        >
          무료로 시작하기 <ChevronRight size={20} />
        </Link>
      </motion.hgroup>

      <motion.div
        variants={scaleIn}
        className="p-4 md:p-8 md:aspect-square rounded-2xl bg-secondary flex items-center justify-center"
      >
        <motion.div
          variants={sectionStagger}
          className="max-w-sm w-full space-y-4"
        >
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={slideInRight}
                className="p-4 md:p-8 w-full rounded-2xl bg-background"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Icon size={20} className="stroke-rose-500" />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
