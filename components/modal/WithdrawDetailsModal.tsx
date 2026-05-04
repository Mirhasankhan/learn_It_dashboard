"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetWithdrawRequestDetailsQuery } from "@/redux/api/withdrawApi";
import { SaudiRiyal } from "lucide-react";

const WithdrawDetailsModal = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetWithdrawRequestDetailsQuery(id);

  const withdraw = data?.result;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-bprimary/10 cursor-pointer text-bprimary px-3 py-1 rounded-[6px]">
          View Details
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Withdraw Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading details...</p>
        ) : withdraw ? (
          <div className="space-y-4 text-sm">
            {/* Amount */}
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium flex items-center"><SaudiRiyal size={15}></SaudiRiyal> {withdraw.amount}</span>
            </div>

            {/* Request Date */}
            <div className="flex justify-between">
              <span className="text-gray-500">Requested At</span>
              <span>
                {new Date(withdraw.createdAt).toLocaleString()}
              </span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-bprimary">{withdraw.status}</span>
            </div>

            <hr />

            {/* Payout Account */}
            <div>
              <h4 className="font-semibold text-bprimary mb-2">Account Information</h4>

              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{withdraw.payoutAccount.name}</span>
              </div>

              <div className="flex py-1 justify-between">
                <span className="text-gray-500">Mobile</span>
                <span>{withdraw.payoutAccount.mobile}</span>
              </div>

              <div className="flex pb-1 justify-between">
                <span className="text-gray-500">IBAN</span>
                <span className="font-mono">
                  {withdraw.payoutAccount.iban}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">City</span>
                <span>{withdraw.payoutAccount.city}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">No data found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDetailsModal;
