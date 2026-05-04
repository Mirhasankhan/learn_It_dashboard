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
import { useGetExpertReportsQuery } from "@/redux/api/report.api";
import Image from "next/image";
import { useState } from "react";
import ReportDetailsModal from "../modal/ReportDetailModal";
import AdminRespondExpertReportModal from "../modal/RespondExpertModal";

const AllExpertReports = () => {
  const [page, setPage] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetExpertReportsQuery(page);

  const reports = data?.result?.expertReports || [];
  const totalPage = data?.result?.meta?.totalPages;

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
        <h1 className="md:font-medium text-lg">Expert Report List</h1>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead className="whitespace-nowrap">Accused User</TableHead>
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
                        {report?.booking?.seeker?.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {report?.booking?.seeker?.uniqueId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{report.orderId}</TableCell>
                  <TableCell>
                    {report.subject == "User_No_Show"
                      ? "User No Show"
                      : report.subject == "Extra_Demands"
                      ? "Extra Demands"
                      : report.subject == "Technical_Failure"
                      ? "Technical Failure"
                      : report.subject == "Unfair_Rating"
                      ? "Unfair Rating"
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
                        report.status === "Release_Payment"
                          ? "bg-green-50 text-green-600"
                          : report.status === "Review_Removed"
                          ? "bg-cyan-50 text-cyan-600"
                          : report.status === "Formal_Warning"
                          ? "bg-yellow-50 text-yellow-600"
                          : report.status === "Account_Suspend"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {report.status === "Release_Payment"
                        ? "Release Payment"
                        : report.status === "Review_Removed"
                        ? "Review Removed"
                        : report.status === "Formal_Warning"
                        ? "Formal Warning"
                        : report.status === "Account_Suspend"
                        ? "Account Suspend"
                        : "Pending"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <ReportDetailsModal
                        role="Expert"
                        reportId={report.id}
                      ></ReportDetailsModal>

                      <AdminRespondExpertReportModal
                        isResponded={report.isResponded}
                        reportId={report.id}
                      ></AdminRespondExpertReportModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoData
                title="Expert Report"
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

export default AllExpertReports;
