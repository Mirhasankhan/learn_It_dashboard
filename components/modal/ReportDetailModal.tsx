"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  useGetExpertReportQuery,
  useGetUserReportQuery,
} from "@/redux/api/report.api";

interface ReportDetailsModalProps {
  reportId: string;
  role: "Expert" | "User";
}

const ReportDetailsModal = ({ reportId, role }: ReportDetailsModalProps) => {
  const { data: userReport, isLoading } = useGetUserReportQuery(reportId);
  const { data: expertReport } = useGetExpertReportQuery(reportId);

  let report;

  if (role == "Expert") {
    report = expertReport?.result;
  } else {
    report = userReport?.result;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-green-50 cursor-pointer text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition">
          View Details
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[700px] overflow-auto bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3 text-lg font-semibold">
            {role} Report
            {/* {report && (
              <Badge
                variant={report.status === "Pending" ? "secondary" : "default"}
                className="uppercase px-2 py-1 text-xs"
              >
                {report.status}
              </Badge>
            )} */}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-gray-500 mt-4">Loading report…</p>
        ) : !report ? (
          <p className="text-sm text-gray-500 mt-4">No report found</p>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {/* Meta Section */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p className="font-medium">{report.orderId}</p>
              </div>
              <div>
                <p className="text-gray-500">Report Status</p>
                <p className="font-medium">{report.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Subject</p>
                <p className="font-medium">
                  {report.subject.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Reported At</p>
                <p className="font-medium">
                  {new Date(report.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* User Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="font-medium text-gray-700 mb-2">{role} Message</p>
              <p className="text-gray-800 text-sm whitespace-pre-wrap wrap-break-word">
                {report.description || "No description provided"}
              </p>
            </div>

            {/* Attachment */}
            {report.fileUrl && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p className="font-medium text-gray-700 mb-2">Attachment</p>
                <div className="relative h-48 w-full rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                  <Image
                    src={report.fileUrl}
                    alt="Report Attachment"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Admin Reply */}
            <div
              className={`rounded-xl p-4 border ${
                report.adminsReply
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-dashed border-gray-200"
              } shadow-sm`}
            >
              <p className="font-medium text-bprimary mb-2">Sefr's Response</p>
              <p
                className={`text-sm ${
                  report.adminsReply ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {report.adminsReply || "Not resonded yet"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
