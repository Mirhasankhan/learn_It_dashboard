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
import { SaudiRiyal } from "lucide-react";
import { useState } from "react";
import Pagination from "../Common/Pagination";

const AllTransactions = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useTransactionsQuery(page);

  console.log(data?.result);
  const totalPage = data?.result?.meta?.totalPages;

  return (
    <div className="bg-white p-3 rounded-2xl">
      <h1 className="md:font-medium pb-2">All Transactions</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <Table className="min-w-[900px] border-separate border-spacing-0">
          <TableHeader className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur">
            <TableRow className="border-b border-gray-100">
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Job Seeker
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Id
              </TableHead>
              <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Service Type
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Transaction Id
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment At
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment Method
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.result?.transactions?.length > 0 ? (
              data.result.transactions.map((user: any) => {
                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-100 transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-bprimary/5"
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {user?.seeker?.userName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user?.seeker?.uniqueId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700">
                      {user?.orderId}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {user?.service?.serviceType == "Cv"
                          ? "Cv Optimization"
                          : user?.service?.serviceType == "Career"
                            ? "Career Consultation"
                            : user?.service?.serviceType == "linkedin"
                              ? "Linkedin Profile Optimization"
                              : "Mock Interview"}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700">
                      {user?.transactionid}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600">
                      {new Date(user?.createdAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600">
                      {user?.paymentMethod}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-semibold text-bprimary">
                      <div className="flex items-center gap-1">
                        <SaudiRiyal size={15} />
                        {user?.price}
                      </div>
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
      {data?.result?.transactions?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllTransactions;
