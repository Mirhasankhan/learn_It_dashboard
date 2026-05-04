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
import { useState } from "react";
import Pagination from "../Common/Pagination";
import { SaudiRiyal, RotateCw } from "lucide-react";
import { useGetAllRefundsQuery } from "@/redux/api/expertApi";

const AllRefunds = () => {
  const [page, setPage] = useState(1);
  const {
    data: refundsData,
    isLoading,
    isFetching,
  } = useGetAllRefundsQuery(page);

  const totalPage = refundsData?.result?.meta?.totalPages;
  const refunds = refundsData?.result?.refunds || [];

  return (
    <div>
      {/* Refunds Table */}
      <div className="p-6 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between mb-6 items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Refunds List</h3>
            <p className="text-sm text-gray-500 mt-1">
              Track all refund transactions
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="border flex items-center gap-2 px-4 text-gray-600 rounded-lg cursor-pointer py-2 hover:bg-gray-50 transition-colors"
          >
            Refresh <RotateCw size={16} />
          </button>
        </div>

        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <TableRow className="hover:bg-none">
              <TableHead className="font-semibold text-gray-700 py-4">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Expert
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Seeker
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Created Date
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {refunds?.length > 0 ? (
              refunds.map((refund: any) => {
                return (
                  <TableRow
                    key={refund.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="py-4">
                      {refund?.booking?.orderId}
                    </TableCell>                 
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {refund?.booking?.expert?.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {refund?.booking?.expert?.uniqueId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {refund?.booking?.seeker?.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {refund?.booking?.seeker?.uniqueId}
                        </span>
                      </div>
                    </TableCell>                 
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1 text-gray-800 font-bold">
                        <SaudiRiyal size={16} className="text-bprimary" />
                        <span>{refund?.amount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">
                      {new Date(refund?.createdAt).toLocaleString("en-US", {
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
                title="Refunds"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>

        {refunds?.length > 0 && (
          <Pagination totalPage={totalPage} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default AllRefunds;
