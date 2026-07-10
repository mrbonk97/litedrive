"use client";

import { Logo } from "@/components/logo";
import { ShareTokenForm } from "@/features/share/ui/share-token-form";
import { motion, stagger, Variants, ViewportOptions } from "motion/react";

interface Props {
  fadeUp: Variants;
  scaleIn: Variants;
  slideInRight: Variants;
  viewport: ViewportOptions;
}

const sectionStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: stagger(0.24),
    },
  },
};

export function LandingSection3({ fadeUp, scaleIn, viewport }: Props) {
  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mt-64"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-6xl font-bold leading-snug tracking-tight"
      >
        업로드부터 공유까지
        <br />
        빠르고 단순하게.
      </motion.h2>

      <motion.div
        variants={scaleIn}
        className="mt-8 w-full rounded-2xl md:border overflow-hidden"
      >
        <div className="p-4 hidden md:flex justify-end gap-2 border-b bg-background">
          <div className="h-4 w-4 rounded-full bg-rose-200" />
          <div className="h-4 w-4 rounded-full bg-rose-400" />
          <div className="h-4 w-4 rounded-full bg-rose-500" />
        </div>

        <div className="p-4 md:p-8 flex items-center justify-center flex-col bg-rose-100">
          <motion.div variants={fadeUp} className="md:my-16 mx-auto max-w-md">
            <Logo className="hidden md:flex" />

            <div className="md:mt-2">
              <ShareTokenForm className="mt-0 rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
