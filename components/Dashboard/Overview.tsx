"use client";

import { useOverviewQuery } from "@/redux/api/adminApi";
import { Ellipsis, SaudiRiyal } from "lucide-react";
import Link from "next/link";

const Overview = () => {
  const { data, isLoading } = useOverviewQuery("");
  return (
    <div className="grid gird-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Link
        href="/job-seeker-management"
        className="border p-6 rounded-xl bg-white"
      >
        <h1 className="text-gray-700">Total Job Seeker</h1>
        {isLoading ? (
          <Ellipsis size={40} className="animate-ping"></Ellipsis>
        ) : (
          <p className="  flex gap-1 items-center font-semibold text-[32px] mt-1">
            {data?.result?.totalJobSeekers}
          </p>
        )}
      </Link>
      <Link
        href="/expert-management"
        className="border p-6 rounded-xl bg-white"
      >
        <h1 className="text-gray-700">Total Career Expert</h1>
        {isLoading ? (
          <Ellipsis size={40} className="animate-ping"></Ellipsis>
        ) : (
          <p className="  flex gap-1 items-center font-semibold text-[32px] mt-1">
            {data?.result?.totalExperts}
          </p>
        )}
      </Link>
      <Link
        href="/expert-management?view=applications"
        className="border p-6 rounded-xl bg-white"
      >
        <h1 className="text-gray-700">Pending Expert Application</h1>
        {isLoading ? (
          <Ellipsis size={40} className="animate-ping"></Ellipsis>
        ) : (
          <p className="  flex gap-1 items-center font-semibold text-[32px] mt-1">
            {data?.result?.totalApplication}
          </p>
        )}
      </Link>
      <Link href="/finance" className="border p-6 rounded-xl bg-white">
        <h1 className="text-gray-700">Total Spent In Platform</h1>
        {isLoading ? (
          <Ellipsis size={40} className="animate-ping"></Ellipsis>
        ) : (
          <p className="  flex gap-1 items-center font-semibold text-[32px] mt-1">
            <SaudiRiyal size={35}></SaudiRiyal> {data?.result?.incomingMoney}
          </p>
        )}
      </Link>
    </div>
  );
};

export default Overview;
