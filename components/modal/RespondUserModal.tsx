"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRespondUserReportMutation } from "@/redux/api/report.api";
import { toast } from "sonner";

interface AdminRespondReportModalProps {
  reportId: string;
  serviceType: string;
  isResponded: boolean;
}

const STATUS_OPTIONS = [
  "Full_Refund",
  "Partial_Refund",
  "No_Refund",
  "Formal_Warning",
  "Account_Suspend",
] as const;

const AdminRespondUserReportModal = ({
  reportId,
  serviceType,
  isResponded,
}: AdminRespondReportModalProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [adminsReply, setAdminsReply] = useState("");
  const [refundRate, setRefundRate] = useState<number | "">("");

  const [respondToReport, { isLoading }] =
    useRespondUserReportMutation();

  const isPartialRefund = status === "Partial_Refund";

  const isFormValid =
    adminsReply.trim().length > 0 &&
    status.length > 0 &&
    (!isPartialRefund ||
      (typeof refundRate === "number" &&
        refundRate > 0 &&
        refundRate <= 100));

  const resetForm = () => {
    setStatus("");
    setAdminsReply("");
    setRefundRate("");
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    const response: any = await respondToReport({
      reportId,
      status,
      adminsReply,
      ...(isPartialRefund && { refundRate }),
    });

    if (response?.data) {
      toast.success(response.data.message);

      // close modal + reset state
      setOpen(false);
      resetForm();
    } else {
      toast.error(
        response?.error?.data?.message || "Failed to respond to report"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isLoading && setOpen(v)}>
      <DialogTrigger asChild>
        <button
          disabled={isResponded}
          onClick={() => setOpen(true)}
          className={`px-4 py-2 rounded-lg ${
            isResponded
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-bprimary/10 text-bprimary cursor-pointer hover:bg-bprimary/20"
          }`}
        >
          {isResponded ? "Responded" : "Respond"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Respond to Report
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Action */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Action
            </label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>

              <SelectContent>
                {STATUS_OPTIONS.map((option) => {
                  if (
                    option === "Partial_Refund" &&
                    serviceType === "mockInterview"
                  ) {
                    return null;
                  }

                  return (
                    <SelectItem key={option} value={option}>
                      {option.replace("_", " ")}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Refund Rate */}
          {isPartialRefund && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Refund Percentage
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                placeholder="e.g. 30"
                value={refundRate}
                onChange={(e) =>
                  setRefundRate(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              />
            </div>
          )}

          {/* Admin Reply */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Admin Reply
            </label>
            <Textarea
              rows={4}
              placeholder="Explain the decision clearly for audit & transparency"
              value={adminsReply}
              onChange={(e) => setAdminsReply(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="bg-bprimary disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRespondUserReportModal;
