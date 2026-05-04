"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoData from "../Common/NoData";
import Pagination from "../Common/Pagination";
import { useState } from "react";
import { useGetAdminSubscriptionEarningsQuery } from "@/redux/api/adminApi";
import { SaudiRiyal } from "lucide-react";

const AllSubscriptionEarnings = () => {
  const [page, setPage] = useState(1);

  const {
    data: adminSubscriptionEarnings,
    isLoading,
    isFetching,
  } = useGetAdminSubscriptionEarningsQuery(page);

  const reports = adminSubscriptionEarnings?.result?.adminEarnings || [];

  const totalPage = adminSubscriptionEarnings?.result?.meta?.totalPages || 1;

  console.log(adminSubscriptionEarnings);

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="mb-6 rounded-xl border border-bprimary/15 bg-linear-to-r from-bprimary/5 via-white to-bprimary/10 p-4 md:p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-bprimary">
              Total Earnings
            </p>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              Earnings from Subscriptions
            </h1>
            <p className="text-sm text-gray-500">
              Combined revenue from job seeker & expert subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bprimary/10 text-bprimary">
              <SaudiRiyal size={28} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                SAR
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {adminSubscriptionEarnings?.result?.totalSubEarnings}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <Table className="min-w-[900px] border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur">
            <TableRow className="border-b border-gray-100">
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                User
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Plan Type
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Amount
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.length > 0 ? (
              reports.map((report: any) => {
                const isExpert = !!report?.expertSubscription;

                const uniqueId = isExpert
                  ? report?.expertSubscription?.expert?.uniqueId
                  : report?.userSubscription?.user?.uniqueId;

                const userName = isExpert
                  ? report?.expertSubscription?.expert?.userName
                  : report?.userSubscription?.user?.userName;

                return (
                  <TableRow
                    key={report?.id}
                    className="border-b border-gray-100 transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-bprimary/5"
                  >
                    {/* USER */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {userName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {uniqueId || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm capitalize text-gray-700">
                      {isExpert
                        ? report?.expertSubscription?.subscriptionPlan?.type ||
                          "N/A"
                        : report?.userSubscription?.subscription?.type || "N/A"}
                    </TableCell>

                    {/* AMOUNT */}
                    <TableCell className="px-5 py-4 text-sm font-semibold text-bprimary">
                      <div className="flex items-center gap-1">
                        <SaudiRiyal size={15} />
                        {report?.amount}
                      </div>
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600">
                      {new Date(report?.createdAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoData
                title="Subscription Earnings"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {reports.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllSubscriptionEarnings;
