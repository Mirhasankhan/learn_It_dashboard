"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function WeeklySessionChart({ setType, weeklyData }: any) {
  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Session Summary</h2>
        <select
          onChange={(e) => setType(e.target.value as "weekly" | "monthly")}
          className="border px-4 py-1 text-gray-600 rounded-[6px]"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weeklyData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis hide />
          <Tooltip />
          <Legend iconType="square" />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="active"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
