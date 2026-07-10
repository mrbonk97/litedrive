"use client";

import Link from "next/link";
import { motion, stagger, Variants, ViewportOptions } from "motion/react";

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
  viewport: ViewportOptions;
}

export function LandingSection5({ fadeUp, viewport }: Props) {
  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mt-64"
    >
      <motion.div
        variants={fadeUp}
        className="p-4 md:p-8 relative overflow-hidden bg-linear-to-br from-rose-400 to-rose-300 rounded-2xl"
      >
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
          지금 바로 시작하세요
        </h2>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="text-background text-lg font-bold hover:underline underline-offset-4"
          >
            회원가입
          </Link>
          <Link
            href="/sign-in"
            className="text-background text-lg font-bold hover:underline underline-offset-4"
          >
            로그인
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
