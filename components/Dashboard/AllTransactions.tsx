"use client";

import { useTransactionsQuery } from "@/redux/api/adminApi";
import NoData from "../Common/NoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaudiRiyal, ArrowUpRight, ReceiptText } from "lucide-react";
import { useState } from "react";
import Pagination from "../Common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllTransactions() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useTransactionsQuery(page);

  const transactions = data?.result?.transactions || [];
  const totalPage = data?.result?.meta?.totalPages || 1;
  const totalCount = data?.result?.meta?.total || transactions.length;
  const isBusy = isLoading || isFetching;

  const getServiceBadge = (type?: string) => {
    switch (type) {
      case "Cv":
        return {
          label: "CV Optimization",
          className: "bg-blue-50 text-blue-700 border-blue-200/70",
        };
      case "Career":
        return {
          label: "Career Consultation",
          className: "bg-orange-50 text-bprimary border-orange-200/70",
        };
      case "linkedin":
        return {
          label: "LinkedIn Optimization",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        };
      default:
        return {
          label: type || "Mock Interview",
          className: "bg-purple-50 text-purple-700 border-purple-200/70",
        };
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            {totalCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                {totalCount} Total
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Latest client purchases and service payments</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100/90 shadow-2xs">
        <Table className="min-w-[850px]">
          <TableHeader className="bg-gray-50/90">
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Job Seeker
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Order ID
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Service
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Transaction ID
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Payment At
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Method
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isBusy ? (
              // High-fidelity Skeleton Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-50">
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24 rounded" />
                        <Skeleton className="h-2.5 w-16 rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Skeleton className="h-4 w-16 rounded" />
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Skeleton className="h-4 w-20 rounded" />
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Skeleton className="h-3.5 w-24 rounded" />
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Skeleton className="h-4 w-14 rounded" />
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right">
                    <Skeleton className="h-4 w-16 ml-auto rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((user: any) => {
                const serviceInfo = getServiceBadge(user?.service?.serviceType);
                return (
                  <TableRow
                    key={user.id || user._id}
                    className="border-b border-gray-50 hover:bg-orange-50/20 transition-colors"
                  >
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200/80 flex items-center justify-center text-xs font-bold text-gray-700">
                          {getInitials(user?.seeker?.userName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-900 leading-tight">
                            {user?.seeker?.userName || "N/A"}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {user?.seeker?.uniqueId || ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100/70 px-2 py-0.5 rounded-md border border-gray-200/40">
                        {user?.orderId || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${serviceInfo.className}`}
                      >
                        {serviceInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {user?.transactionid || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs text-gray-600">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs font-medium text-gray-600">
                      <span className="capitalize">{user?.paymentMethod || "Online"}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-right">
                      <span className="inline-flex items-center justify-end gap-1 font-bold text-sm text-bprimary">
                        <SaudiRiyal className="w-3.5 h-3.5" />
                        {Number(user?.price || 0).toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoData
                title="Transactions"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {!isBusy && transactions.length > 0 && totalPage > 1 && (
        <div className="pt-4 mt-2 border-t border-gray-50 flex justify-end">
          <Pagination totalPage={totalPage} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
}

