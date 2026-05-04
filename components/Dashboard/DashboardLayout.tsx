"use client";
import { useSessionSummaryQuery, useSummaryQuery } from "@/redux/api/adminApi";
import Overview from "./Overview";
import { ServiceOverview } from "./ServiceOverview";
import { MonthlyEarnings } from "./MonthlyEarnings";
import { useState } from "react";
import { WeeklyEarnings } from "./WeeklyEarnings";
import WeeklySessionChart from "./WeeklySessionSummary";
import MonthlySessionChart from "./MonthlySessionSummary";

const DashboardLayout = () => {
  const [type, setType] = useState("monthly");
  const [sessionType, setSessionType] = useState("monthly");
  const { data } = useSummaryQuery(type);
  const { data: sessionData } = useSessionSummaryQuery(sessionType);

  return (
    <div>
      <Overview></Overview>
      <div className="grid grid-cols-3 mt-8 gap-8">
        <div className="col-span-3 lg:col-span-2">
          {type == "monthly" ? (
            <MonthlyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
            ></MonthlyEarnings>
          ) : (
            <WeeklyEarnings
              setType={setType}
              chartData={data?.result?.chartData}
            ></WeeklyEarnings>
          )}
        </div>
        <div className="col-span-3 lg:col-span-1">
          <ServiceOverview></ServiceOverview>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-6 gap-6">
        <div className="lg:col-span-1 col-span-2">
          {sessionType == "monthly" ? (
            <MonthlySessionChart monthlyData={sessionData?.result} setType={setSessionType}></MonthlySessionChart>
          ) : (
            <WeeklySessionChart weeklyData={sessionData?.result} setType={setSessionType}></WeeklySessionChart>
          )}
        </div>
        <div className="lg:col-span-1 col-span-2">
          {/* <AllTransactions></AllTransactions> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
