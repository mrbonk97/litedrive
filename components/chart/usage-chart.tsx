"use client";

import { convertByte } from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface Props {
  usage: number;
}

const MAX_USAGE = 5 * 1024 * 1024 * 1024; // 5GB = 5,368,709,120 Bytes

export function UsageChart({ usage }: Props) {
  const safeUsage = Math.min(usage, MAX_USAGE);

  // ✅ 차트 데이터 (절대 byte 값 그대로)
  const chartData = [
    {
      name: "usage",
      value: safeUsage,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const chartConfig = {
    usage: {
      label: "파일 사용량",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + 360 * (safeUsage / MAX_USAGE)}
        innerRadius={80}
        outerRadius={110}
      >
        {/* ✅ 배경 원 */}
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />

        {/* ✅ 실제 게이지 */}
        <RadialBar dataKey="value" cornerRadius={10} background fill="hsl(var(--chart-2))" />

        {/* ✅ 0~5GB 절대 범위 */}
        <PolarRadiusAxis
          domain={[0, MAX_USAGE]} // <- 핵심: Byte 단위 도메인 지정
          tick={false}
          tickLine={false}
          axisLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {convertByte(safeUsage)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-sm"
                    >
                      / 5GB
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
