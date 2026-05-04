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
import { useState } from "react";
import { useRespondExpertReportMutation } from "@/redux/api/report.api";
import { toast } from "sonner";

interface AdminRespondExpertReportModalProps {
  reportId: string;
  isResponded: boolean;
}

const STATUS_OPTIONS = [
  "Release_Payment",
  "Review_Removed",
  "Formal_Warning",
  "Account_Suspend",
] as const;

const AdminRespondExpertReportModal = ({
  reportId,
  isResponded,
}: AdminRespondExpertReportModalProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [adminsReply, setAdminsReply] = useState("");

  const [respondToReport, { isLoading }] =
    useRespondExpertReportMutation();

  const isFormValid =
    status.length > 0 && adminsReply.trim().length > 0;

  const resetForm = () => {
    setStatus("");
    setAdminsReply("");
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    const response: any = await respondToReport({
      reportId,
      status,
      adminsReply,
    });

    if (response?.data) {
      toast.success(response.data.message);
      setOpen(false);
      resetForm();
    } else {
      toast.error(
        response?.error?.data?.message ||
          "Failed to respond to report"
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
            Respond to Expert Report
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
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admin Reply */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Admin Reply
            </label>
            <Textarea
              rows={4}
              placeholder="Provide a clear, auditable explanation"
              value={adminsReply}
              onChange={(e) => setAdminsReply(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="bg-bprimary disabled:bg-gray-300 cursor-pointer text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRespondExpertReportModal;
