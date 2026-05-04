"use client";
import AllTransactions from "@/components/Dashboard/AllTransactions";
import AllBookingEarnings from "@/components/platform-earnings/AllBookingEarnings";
import AllRefunds from "@/components/platform-earnings/AllRefunds";
import AllSubscriptionEarnings from "@/components/platform-earnings/AllSubscriptionEarnings";
import { useTransactionsQuery } from "@/redux/api/adminApi";
import { Ellipsis, SaudiRiyal } from "lucide-react";
import { useState } from "react";

const Financepage = () => {
  const [active, setActive] = useState("transaction");
  const { data, isLoading } = useTransactionsQuery("");

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        <div
          onClick={() => setActive("transaction")}
          className={`cursor-pointer ${active == "transaction" ? "bg-bprimary text-white" : "bg-white"} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
        >
          <h1 className="font-medium">Total Booking Transaction</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="flex gap-2 items-center font-semibold text-[32px] mt-2">
              <SaudiRiyal size={35}></SaudiRiyal>{" "}
              {data?.result?.totalBookingAmount}
            </p>
          )}
        </div>
        <div
          onClick={() => setActive("sessionorder")}
          className={`cursor-pointer ${active == "sessionorder" ? "bg-bprimary text-white" : "bg-white"} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
        >
          <h1 className="font-medium">Platform Earnings (Session & Orders)</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="flex gap-2 items-center font-semibold text-[32px] mt-2">
              <SaudiRiyal size={35}></SaudiRiyal>{" "}
              {data?.result?.bookingEarnings}
            </p>
          )}
        </div>
        <div
          onClick={() => setActive("subscription")}
          className={`cursor-pointer ${active == "subscription" ? "bg-bprimary text-white" : "bg-white"} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
        >
          <h1 className="font-medium">Platform Earnings (Subscriptions)</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="flex gap-2 items-center font-semibold text-[32px] mt-2">
              <SaudiRiyal size={35}></SaudiRiyal> {data?.result?.subEarnings}
            </p>
          )}
        </div>
        <div
          onClick={() => setActive("refund")}
          className={`cursor-pointer ${active == "refund" ? "bg-bprimary text-white" : "bg-white"} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
        >
          <h1 className="font-medium">Total Refund</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="flex gap-2 items-center font-semibold text-[32px] mt-2">
              <SaudiRiyal size={35}></SaudiRiyal> {data?.result?.refundAmount}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8">
        {active == "transaction" && <AllTransactions></AllTransactions>}
        {active == "sessionorder" && <AllBookingEarnings></AllBookingEarnings>}
        {active == "subscription" && (
          <AllSubscriptionEarnings></AllSubscriptionEarnings>
        )}
        {active == "refund" && (
          <AllRefunds></AllRefunds>
        )}
      </div>
    </div>
  );
};

export default Financepage;
