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
import { useGetUserReportsQuery } from "@/redux/api/report.api";
import Image from "next/image";
import { useState } from "react";
import ReportDetailsModal from "../modal/ReportDetailModal";
import AdminRespondUserReportModal from "../modal/RespondUserModal";

const AllReports = () => {
  const [page, setPage] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetUserReportsQuery(page);

  const reports = data?.result?.userReports || [];
  const totalPage = data?.result?.meta?.totalPages;

  console.log(reports);

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setIsPreviewOpen(false);
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="md:font-medium text-lg">User Report List</h1>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Report ID</TableHead>

              <TableHead className="whitespace-nowrap">
                Accused Expert
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Reported At</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.length > 0 ? (
              reports.map((report: any) => (
                <TableRow key={report.id}>
                  <TableCell>{report.reportId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {report?.booking?.expert?.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {report?.booking?.expert?.uniqueId}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{report.orderId}</TableCell>

                  <TableCell>
                    {report.subject == "Expert_No_Show"
                      ? "Expert No Show"
                      : report.subject == "Non_Delivery"
                        ? "Non Delivery"
                        : report.subject == "Technical_Failure"
                          ? "Technical Failure"
                          : report.subject == "Quality_Issue"
                            ? "Quality Issue"
                            : "Bad Behaviour"}
                  </TableCell>

                  <TableCell>
                    {new Date(report.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>

                  <TableCell>
                    {report?.booking?.service?.serviceType == "Cv"
                      ? "CV Optimization"
                      : report?.booking?.service?.serviceType == "MockInterview"
                        ? "Mock Interview"
                        : report?.booking?.service?.serviceType == "Career"
                          ? "Career Consultation"
                          : "Linkedin profile optimization"}
                  </TableCell>

                  <TableCell>
                    {report.fileUrl ? (
                      <button
                        onClick={() => handlePreview(report.fileUrl)}
                        className="text-blue-600 underline font-medium"
                      >
                        View Attachment
                      </button>
                    ) : (
                      <span className="text-gray-400">No attachment</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-md text-sm font-medium ${
                        report.status === "Full_Refund"
                          ? "bg-green-50 text-green-600"
                          : report.status === "Partial_Refund"
                            ? "bg-lime-50 text-lime-600"
                            : report.status === "No_Refund"
                              ? "bg-gray-50 text-gray-600"
                              : report.status === "Formal_Warning"
                                ? "bg-yellow-50 text-yellow-600"
                                : report.status === "Account_Suspend"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {report.status === "Full_Refund"
                        ? "Full Refund"
                        : report.status === "No_Refund"
                          ? "No Refund"
                          : report.status === "Formal_Warning"
                            ? "Formal Warning"
                            : report.status === "Partial_Refund"
                              ? "Partial Refund"
                              : report.status === "Account_Suspend"
                                ? "Account Suspend"
                                : "Pending"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <ReportDetailsModal
                        role="User"
                        reportId={report.id}
                      ></ReportDetailsModal>

                      <AdminRespondUserReportModal
                        isResponded={report.isResponded}
                        reportId={report.id}
                        serviceType="mockInterview"
                        // serviceType={report?.booking?.service?.serviceType}
                      ></AdminRespondUserReportModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoData
                title="User Report"
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

export default AllReports;
