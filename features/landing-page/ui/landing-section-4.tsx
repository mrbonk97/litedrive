"use client";

import { ShieldCheck, Trash2 } from "lucide-react";
import { motion, stagger, Variants, ViewportOptions } from "motion/react";

const items = [
  {
    title: "잔여 파일 자동 제거",
    description:
      "잊고 남겨둔 임시 파일과 공유 파일을 만료 시점에 자동으로 삭제합니다.",
    icon: Trash2,
  },
  {
    title: "유출 가능성 감소",
    description:
      "파일이 남아 있는 시간을 줄여 예기치 않은 접근과 외부 노출 위험을 낮춥니다.",
    icon: ShieldCheck,
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
  slideInRight: Variants;
  viewport: ViewportOptions;
}

export function LandingSection4({ fadeUp, slideInRight, viewport }: Props) {
  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mt-64 grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <motion.hgroup variants={sectionStagger}>
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-6xl font-bold tracking-tight leading-snug"
        >
          오래 남은 파일이
          <br />
          위험이 되지 않도록.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-sm text-balance break-keep text-muted-foreground"
        >
          공유 파일이나 임시 파일은 필요가 끝난 뒤에도 남아 있을 수 있습니다.
          Litedrive는 파일마다 자동 삭제 기간을 설정해, 불필요한 보관으로 발생할
          수 있는 노출 위험을 줄입니다.
        </motion.p>

        <motion.ul
          variants={sectionStagger}
          className="mt-8 md:mt-16 space-y-8"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.title}
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-rose-50">
                  <Icon size={20} className="stroke-rose-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">
                    {item.title}
                  </h5>
                  <p className="mt-2 text-sm text-balance break-keep text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.hgroup>

      <motion.div
        variants={slideInRight}
        className="p-4 md:p-8 rounded-2xl bg-secondary"
      >
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            파일 보안 설정
          </p>
          <h3 className="mt-2 text-2xl font-bold">만료 후 자동 삭제</h3>
        </div>

        <div className="mt-16 p-4 flex justify-between gap-4 rounded-2xl bg-background">
          <div>
            <p className="font-semibold">자동 삭제 사용</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              설정한 기간이 지나면 파일을 자동으로 삭제해 남아 있는 위험을
              줄입니다.
            </p>
          </div>

          <div className="p-2 h-8 w-16 shrink-0 flex justify-end items-center rounded-full bg-rose-400 shadow-inner">
            <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-background">
            <p className="text-sm text-muted-foreground">보관 제한</p>
            <p className="mt-2 text-xl font-bold">7일</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-400 text-background">
            <p className="text-sm">노출 가능 시간</p>
            <p className="mt-2 text-xl font-bold">제한됨</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-background">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">shared-report.pdf</p>
              <p className="text-sm text-balance break-keep text-muted-foreground">
                7일이 지나면 파일이 자동으로 삭제됩니다.
              </p>
            </div>

            <div className="px-4 py-1 shrink-0 rounded-full text-rose-500 bg-rose-100 text-sm font-medium">
              D-7
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "80%" }}
              transition={{
                duration: 1,
                ease: "circInOut",
              }}
              viewport={viewport}
              className="h-2 rounded-full bg-rose-500"
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
