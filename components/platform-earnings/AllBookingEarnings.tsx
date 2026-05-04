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
import Image from "next/image";
import { useState } from "react";
import { useGetAdminBookingEarningsQuery } from "@/redux/api/adminApi";
import { SaudiRiyal } from "lucide-react";

const AllBookingEarnings = () => {
  const [page, setPage] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    data: adminBookingEarnings,
    isLoading,
    isFetching,
  } = useGetAdminBookingEarningsQuery(page);

  const reports = adminBookingEarnings?.result?.adminEarnings || [];
  const totalPage = adminBookingEarnings?.result?.meta?.totalPages;

  const closePreview = () => {
    setPreviewImage(null);
    setIsPreviewOpen(false);
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="mb-6 rounded-xl border border-bprimary/15 bg-linear-to-r from-bprimary/5 via-white to-bprimary/10 p-4 md:p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-bprimary">
              Total Earnings
            </p>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              Earnings from completed sessions and orders
            </h1>
            <p className="text-sm text-gray-500">
              Combined revenue from confirmed sessions and order commissions.
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
                {adminBookingEarnings?.result?.totalBookingEarnings}
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
                Order Id
              </TableHead>
              <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Earning Type
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
              reports.map((report: any) => (
                <TableRow
                  key={report.id}
                  className="border-b border-gray-100 transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-bprimary/5"
                >
                  <TableCell className="px-5 py-4 text-sm font-medium text-gray-900">
                    {report?.booking?.orderId}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600">
                    {report?.earningType == "Session"
                      ? "Session Cut"
                      : "Order Cut"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm font-semibold text-bprimary">
                    <div className="flex items-center gap-1">
                      <SaudiRiyal size={15} />
                      {report?.amount}
                    </div>
                  </TableCell>
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
              ))
            ) : (
              <NoData
                title="Session & Order Earnings"
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

      {/* Evidence Preview Modal */}
      {isPreviewOpen && previewImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative bg-white rounded-xl p-4 max-w-5xl w-full mx-4">
            <button
              onClick={closePreview}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <Image
              src={previewImage}
              alt="Report Evidence"
              width={1400}
              height={900}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookingEarnings;
