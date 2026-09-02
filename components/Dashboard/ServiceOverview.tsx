"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewQuery } from "@/redux/api/adminApi";
import { PieChart as PieIcon, Layers } from "lucide-react";

const SERVICE_COLORS = [
  { key: "Career Consultation", color: "#E35314", lightBg: "bg-orange-50 text-bprimary border-orange-100" },
  { key: "CV Optimization", color: "#3B82F6", lightBg: "bg-blue-50 text-blue-600 border-blue-100" },
  { key: "LinkedIn Optimization", color: "#10B981", lightBg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-gray-800 text-xs">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          {data.name}
        </p>
        <p className="text-gray-300 mt-1">
          <span className="font-bold text-white">{data.value}</span> requests ({data.payload.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

export function ServiceOverview() {
  const { data, isLoading } = useOverviewQuery("");
  const overview = data?.result;

  const rawData = [
    {
      name: "Career Consultation",
      value: Number(overview?.totalCareerConsultation) || 0,
      fill: "#E35314",
    },
    {
      name: "CV Optimization",
      value: Number(overview?.totalCvOptimizatoin) || 0,
      fill: "#3B82F6",
    },
    {
      name: "LinkedIn Optimization",
      value: Number(overview?.totalLinkedInOptimizatoin) || 0,
      fill: "#10B981",
    },
  ];

  const totalCount = rawData.reduce((acc, curr) => acc + curr.value, 0);

  const chartData = rawData
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      percent: totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0,
    }));

  return (
    <Card className="rounded-2xl border-gray-100/90 shadow-xs bg-white overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-gray-900">Service Overview</CardTitle>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {totalCount} Total
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Distribution across services</p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <Skeleton className="w-36 h-36 rounded-full" />
            <div className="w-full space-y-2.5">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <PieIcon className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">No service activity yet</p>
            <p className="text-xs text-gray-400 mt-1">Bookings will reflect here once requested</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Donut Chart with center label */}
            <div className="relative h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    cornerRadius={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-900">{totalCount}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Services</span>
              </div>
            </div>

            {/* Custom Legend List */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {rawData.map((service, idx) => {
                const percent = totalCount > 0 ? Math.round((service.value / totalCount) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: service.fill }}
                      />
                      <span className="font-medium text-gray-700 truncate max-w-[140px] sm:max-w-[180px]">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{service.value}</span>
                      <span className="text-[11px] font-medium text-gray-400 min-w-[32px] text-right">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

