/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  useAcceptUserMutation,
  useGetAllWithdrawRequestsQuery,
  useRejectUserMutation,
} from "@/redux/api/withdrawApi";
import DataTable from "../Common/DataTable";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ViewWithdrawDetails from "./ViewWithdrawDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { LuLoader } from "react-icons/lu";
import { toast } from "sonner";

const Withdrawals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const { data, isLoading } = useGetAllWithdrawRequestsQuery({
    currentPage,
    searchTerm,
  });

  const [AcceptUser, { isLoading: isAccepting }] = useAcceptUserMutation();
  const [RejectUser, { isLoading: isRejecting }] = useRejectUserMutation();

  const handleAccept = async (id: string) => {
    try {
      const response = await AcceptUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await RejectUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  };

  const formatedData = data?.result?.withdraws?.map((entry: any) => ({
    Id: entry?.id,
    "Expert Name": entry?.expert?.userName,
    Amount: "⃁ " + entry?.amount + "/=",
    "Requests Date": new Date(entry?.createdAt).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    Status:
      entry?.status === "Accepted" ? (
        <div className="text-[#53C31B] text-xs bg-[#EEF9E8] rounded-lg flex justify-center w-fit px-2 py-1">
          Accepted
        </div>
      ) : entry?.status === "In_Progress" ? (
        <div className="text-[#FE4D4F] text-xs bg-[#FFEDED] rounded-lg flex justify-center w-fit px-2 py-1">
          In Progress
        </div>
      ) : (
        <div className="text-[#FAAD14] text-xs bg-[#FAAD141A] rounded-lg flex justify-center w-fit px-2 py-1">
          Pending
        </div>
      ),
    Action: (
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-[#FF4D4F] bg-[#FF4D4F1A] hover:bg-[#FF4D4F33] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2">
              {isRejecting && selectedId === entry?.id ? (
                <div className="flex justify-center items-center gap-2">
                  Rejecting...{" "}
                  <div className="animate-spin">
                    <LuLoader size={18} />
                  </div>
                </div>
              ) : (
                <div>Reject</div>
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="z-50">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setSelectedId(entry?.id);
                  handleReject(entry?.id);
                }}
                className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-[#52C41A] bg-[#52C41A1A] hover:bg-[#52C41A33] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2">
              {isAccepting && selectedId === entry?.id ? (
                <div className="flex justify-center items-center gap-2">
                  Accepting...{" "}
                  <div className="animate-spin">
                    <LuLoader size={18} />
                  </div>
                </div>
              ) : (
                <div>Accept</div>
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="z-50">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setSelectedId(entry?.id);
                  handleAccept(entry?.id);
                }}
                className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger>
            <button className="text-bprimary bg-[#E353141A] hover:bg-[#E3531433] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2">
              View Details
            </button>
          </DialogTrigger>
          <ViewWithdrawDetails id={entry?.id} />
        </Dialog>
      </div>
    ),
  }));

  return (
    <div>
      <div className="md:flex items-center gap-6">
        <div className="flex-1 bg-white rounded-xl p-5">
          <h1 className="text-[#636F85] font-medium">
            Total Transferred Money
          </h1>
          <p className="text-[#2D2D2D] font-semibold text-[32px] mt-1">
            ⃁ {data?.result?.meta?.totalTransferred}
          </p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-5 mt-6 md:mt-0">
          <h1 className="text-[#636F85] font-medium">Payout Requests</h1>
          <p className="text-[#2D2D2D] font-semibold text-[32px] mt-1">
            {data?.result?.meta?.totalRequests}
          </p>
        </div>
      </div>

      <DataTable
        title="Withdrawal Requests"
        data={formatedData}
        isLoading={isLoading}
        willSearch={true}
        totalPage={data?.result?.meta?.totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default Withdrawals;
