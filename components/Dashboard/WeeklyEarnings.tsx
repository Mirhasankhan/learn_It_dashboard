"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SaudiRiyal } from "lucide-react";

type WeeklyEarning = {
  day: string; // Sat, Sun, Mon...
  earnings: number;
};

type Props = {
  chartData?: WeeklyEarning[];
  setType: (value: "weekly" | "monthly") => void;
  isLoading?: boolean;
  isFetching?: boolean;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-gray-800 text-xs">
        <p className="font-medium text-gray-400 mb-1">{label}</p>
        <div className="flex items-center gap-1.5 font-bold text-sm text-white">
          <span className="text-orange-400 flex items-center">
            <SaudiRiyal className="w-4 h-4 inline mr-0.5" />
            {Number(payload[0].value).toLocaleString()}
          </span>
          <span className="text-gray-400 font-normal text-xs">SAR</span>
        </div>
      </div>
    );
  }
  return null;
};

export function WeeklyEarnings({ chartData = [], setType, isLoading, isFetching }: Props) {
  const isBusy = isLoading || isFetching;

  // Calculate total in current view
  const totalEarnings = chartData.reduce((acc, curr) => acc + (Number(curr.earnings) || 0), 0);

  return (
    <Card className="rounded-2xl border-gray-100/90 shadow-xs bg-white overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-gray-900">Platform Earnings</CardTitle>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-bprimary border border-orange-100">
              Weekly
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total for period: <span className="font-semibold text-gray-900">{totalEarnings.toLocaleString()} SAR</span>
          </p>
        </div>

        {/* Modern Segmented Control */}
        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setType("monthly")}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900"
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setType("weekly")}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 bg-white text-bprimary shadow-xs"
          >
            Weekly
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isBusy ? (
          <div className="h-[280px] w-full flex flex-col justify-end gap-3 pb-4">
            <div className="flex items-end justify-between gap-4 h-[240px] px-6">
              {[50, 80, 40, 95, 65, 30, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <Skeleton
                    className="w-full rounded-t-md"
                    style={{ height: `${height}%` }}
                  />
                  <Skeleton className="h-3 w-10 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-sm">No weekly earnings recorded yet</p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="weeklyEarningGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E35314" stopOpacity={1} />
                    <stop offset="100%" stopColor="#FF7A3D" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(227, 83, 20, 0.05)", radius: 6 }} />
                <Bar
                  dataKey="earnings"
                  fill="url(#weeklyEarningGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

