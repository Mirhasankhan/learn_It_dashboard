"use client";

import { useSessionSummaryQuery, useSummaryQuery } from "@/redux/api/adminApi";
import Overview from "./Overview";
import { ServiceOverview } from "./ServiceOverview";
import { MonthlyEarnings } from "./MonthlyEarnings";
import { useState } from "react";
import { WeeklyEarnings } from "./WeeklyEarnings";
import WeeklySessionChart from "./WeeklySessionSummary";
import MonthlySessionChart from "./MonthlySessionSummary";
import AllTransactions from "./AllTransactions";

export default function DashboardLayout() {
  const [type, setType] = useState<"monthly" | "weekly">("monthly");
  const [sessionType, setSessionType] = useState<"monthly" | "weekly">("monthly");

  const { data, isLoading, isFetching } = useSummaryQuery(type);
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isFetching: sessionFetching,
  } = useSessionSummaryQuery(sessionType);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Overview Cards */}
      <Overview />

      {/* Middle Row: Platform Earnings & Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {type === "monthly" ? (
            <MonthlyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          ) : (
            <WeeklyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <ServiceOverview />
        </div>
      </div>

      {/* Bottom Row: Session Performance & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {sessionType === "monthly" ? (
            <MonthlySessionChart
              monthlyData={sessionData?.result}
              setType={setSessionType}
              isLoading={sessionLoading}
              isFetching={sessionFetching}
            />
          ) : (
            <WeeklySessionChart
              weeklyData={sessionData?.result}
              setType={setSessionType}
              isLoading={sessionLoading}
              isFetching={sessionFetching}
            />
          )}
        </div>
        <div>
          <AllTransactions />
        </div>
      </div>
    </div>
  );
}

