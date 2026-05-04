"use client";

import React, { useRef } from "react";
import { useGetWithdrawRequestDetailsQuery } from "@/redux/api/withdrawApi";
import { DialogClose, DialogContent } from "../ui/dialog";
import { SyncLoader } from "react-spinners";

const ViewWithdrawDetails = ({ id }: { id: string }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, isLoading } = useGetWithdrawRequestDetailsQuery(id);

  if (isLoading) {
    return (
      <DialogContent className="p-10" showCloseButton>
        <div className="flex justify-center items-center gap-4">
          <span className="text-bprimary font-medium">Data is Loading</span>
          <SyncLoader color="#E35314" />
        </div>
      </DialogContent>
    );
  }

  if (!data?.result) {
    return (
      <DialogContent className="p-10" showCloseButton>
        <p className="text-center text-gray-700">No data found!</p>
      </DialogContent>
    );
  }

  // Extract data with fallback values
  const withdraw = data.result ?? {};
  const payout = withdraw.payoutAccount ?? {};

  const amount = withdraw.amount ?? "N/A";
  const createdAt = withdraw.createdAt
    ? new Date(withdraw.createdAt).toLocaleString()
    : "N/A";

  const name = payout.name ?? "N/A";
  const city = payout.city ?? "N/A";
  const mobile = payout.mobile ?? "N/A";
  const iban = payout.iban ?? "N/A";
  const payoutCreatedAt = payout.createdAt
    ? new Date(payout.createdAt).toLocaleString()
    : "N/A";

  return (
    <DialogContent className="p-6 md:p-10 rounded-xl max-w-sm md:max-w-lg max-h-[75vh] overflow-y-auto">
      <DialogClose ref={closeRef} className="hidden" />

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-4">Withdraw Request Details</h2>

      {/* AMOUNT */}
      <div className="mb-4">
        <p className="text-gray-600">Withdraw Amount</p>
        <p className="text-lg font-semibold">{amount} SAR</p>
      </div>

      {/* REQUEST INFO */}
      <div className="mb-4">
        <p className="text-gray-600">Request Date</p>
        <p className="font-medium">{createdAt}</p>
      </div>

      {/* ACCOUNT INFO */}
      <div className="">
        <h3 className="text-lg font-semibold mb-3">Payout Account</h3>

        <div className="space-y-3">
          <div>
            <p className="text-gray-600">Account Holder Name</p>
            <p className="font-medium">{name}</p>
          </div>

          <div>
            <p className="text-gray-600">Mobile</p>
            <p className="font-medium">{mobile}</p>
          </div>

          <div>
            <p className="text-gray-600">City</p>
            <p className="font-medium">{city}</p>
          </div>

          <div>
            <p className="text-gray-600">IBAN</p>
            <p className="font-medium wrap-break-word">{iban}</p>
          </div>

          <div>
            <p className="text-gray-600">Account Added On</p>
            <p className="font-medium">{payoutCreatedAt}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ViewWithdrawDetails;
