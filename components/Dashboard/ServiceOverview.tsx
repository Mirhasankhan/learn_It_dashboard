"use client";

import { Pie, PieChart, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useOverviewQuery } from "@/redux/api/adminApi";

/**
 * Chart configuration aligned with real services
 */
const chartConfig = {
  value: {
    label: "Service",
  },
  career: {
    label: "Career Consultation",
    color: "var(--chart-1)",
  },
  cv: {
    label: "CV Optimization",
    color: "var(--chart-2)",
  },
  linkedin: {
    label: "LinkedIn Optimization",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ServiceOverview() {
  const { data, isLoading } = useOverviewQuery("");

  const overview = data?.result;

  /**
   * Derive pie data from API response
   * Zero-value services are excluded to avoid visual noise
   */
  const chartData = overview
    ? [
        {
          name: "Career Consultation",
          value: overview.totalCareerConsultation,
          fill: "#FAAD14",
        },
        {
          name: "CV Optimization",
          value: overview.totalCvOptimizatoin,
          fill: "#2196F3",
        },
        {
          name: "LinkedIn Optimization",
          value: overview.totalLinkedInOptimizatoin,
          fill: "#52C41A",
        },
      ].filter(item => item.value > 0)
    : [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Service Overview</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[289px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
               outerRadius="95%"
              innerRadius={0} // remove if you want a full pie instead of donut
            >
              <LabelList
                dataKey="name"
                stroke="none"
                fontSize={8}
                formatter={(value: string) => value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {!isLoading && chartData.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No service activity available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
