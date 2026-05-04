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

export default function MonthlySessionChart({ setType, monthlyData }: any) {
  return (
    <div className="w-full h-[450px] p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Session Summary</h2>
        <select
          onChange={(e) => setType(e.target.value as "weekly" | "monthly")}
          className="border px-4 py-1 text-gray-600 rounded-[6px]"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={monthlyData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            vertical={true}
            horizontal={false}
            stroke="#F3F4F6"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            dy={10}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px" }}
          />

          {/* Completed - Green */}
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22C55E"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* Active - Blue */}
          <Line
            type="monotone"
            dataKey="active"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* Rejected - Red */}
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#EF4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
