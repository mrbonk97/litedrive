"use client";

import { LogoIcon } from "@/components/logo-icon";
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

export function LandingSection1({ fadeUp, viewport }: Props) {
  return (
    <motion.header
      variants={sectionStagger}
      viewport={viewport}
      initial="hidden"
      animate="show"
      className="mt-16"
    >
      <motion.div variants={fadeUp} className="mx-auto w-fit">
        <LogoIcon />
      </motion.div>
      <motion.h1
        variants={fadeUp}
        className="mt-8 text-4xl md:text-6xl font-bold text-center leading-snug"
      >
        개인정보 없이 쓰는
        <br />
        가벼운 파일 드라이브
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-4 md:mt-8 text-center text-muted-foreground break-keep text-balance"
      >
        간단하게 가입하고, 안전하게 보관하고, 조건 없이 사용하세요.
      </motion.p>
    </motion.header>
  );
}
