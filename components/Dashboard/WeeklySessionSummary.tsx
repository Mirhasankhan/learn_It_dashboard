"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  setType: (val: "monthly" | "weekly") => void;
  weeklyData?: Array<{
    day: string;
    completed: number;
    active: number;
    rejected: number;
  }>;
  isLoading?: boolean;
  isFetching?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md text-white px-3.5 py-3 rounded-xl shadow-xl border border-gray-800 text-xs min-w-[150px]">
        <p className="font-semibold text-gray-300 pb-1.5 mb-1.5 border-b border-gray-800">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 capitalize text-gray-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklySessionChart({
  setType,
  weeklyData = [],
  isLoading,
  isFetching,
}: Props) {
  const isBusy = isLoading || isFetching;

  // Calculate totals
  const totalCompleted = weeklyData.reduce((acc, curr) => acc + (Number(curr.completed) || 0), 0);
  const totalActive = weeklyData.reduce((acc, curr) => acc + (Number(curr.active) || 0), 0);
  const totalRejected = weeklyData.reduce((acc, curr) => acc + (Number(curr.rejected) || 0), 0);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100/90 shadow-xs p-5 flex flex-col justify-between">
      {/* Header with Title and Segmented Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Session Summary</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Weekly
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Sessions status progression this week</p>
        </div>

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
      </div>

      {/* Legend Indicators with counts */}
      <div className="flex flex-wrap items-center gap-3 pt-3 pb-2 text-xs">
        <div className="flex items-center gap-1.5 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100/60">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-gray-600 font-medium">Completed:</span>
          <span className="font-bold text-emerald-700">{totalCompleted}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-100/60">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <span className="text-gray-600 font-medium">Active:</span>
          <span className="font-bold text-blue-700">{totalActive}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50/60 px-2.5 py-1 rounded-lg border border-rose-100/60">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-gray-600 font-medium">Rejected:</span>
          <span className="font-bold text-rose-700">{totalRejected}</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        {isBusy ? (
          <div className="h-full w-full flex flex-col justify-end gap-3 pb-2">
            <div className="flex items-end justify-between gap-4 h-[220px] px-4">
              {[45, 75, 60, 90, 40, 80, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <Skeleton
                    className="w-full rounded-md"
                    style={{ height: `${height}%` }}
                  />
                  <Skeleton className="h-2.5 w-8 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        ) : weeklyData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No weekly session data recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weeklyData}
              margin={{ top: 10, right: 10, bottom: 0, left: -25 }}
            >
              <defs>
                <linearGradient id="colorWeeklyCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWeeklyActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWeeklyRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickMargin={10}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="completed"
                name="completed"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorWeeklyCompleted)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="active"
                name="active"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorWeeklyActive)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="rejected"
                name="rejected"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorWeeklyRejected)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

