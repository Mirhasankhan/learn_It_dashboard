/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import defaultImg from "@/assets/no-img.jpg";
import DataTable from "../Common/DataTable";
import {
  useAcceptUserMutation,
  useGetAllExpertApplicationsQuery,
} from "@/redux/api/expertApi";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ViewExpertApplicantDetails from "./ViewExpertApplicantDetails";
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

const ExpertApplications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const { data, isLoading } = useGetAllExpertApplicationsQuery({
    currentPage,
    searchTerm,
  });

  const [AcceptUser, { isLoading: isAccepting }] = useAcceptUserMutation();

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

  const formatedData = data?.result?.experts?.map((entry: any) => ({
    Id: entry?.id,
    User: (
      <div className="flex items-center gap-2">
        <Image
          src={entry?.profileImage || defaultImg}
          height={50}
          width={50}
          alt={entry?.userName || "User"}
          className="h-10 w-10 rounded-md"
          priority
        />
        <p>{entry?.userName}</p>
      </div>
    ),
    "Phone Number": entry?.phoneNumber,
    "Join Date": new Date(entry?.createdAt).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    Status:
      entry?.status === "selected" ? (
        <div className="text-[#53C31B] text-xs bg-[#EEF9E8] rounded-lg flex justify-center w-fit px-2 py-1">
          Selected
        </div>
      ) : entry?.status === "rejected" ? (
        <div className="text-[#FE4D4F] text-xs bg-[#FFEDED] rounded-lg flex justify-center w-fit px-2 py-1">
          Rejected
        </div>
      ) : (
        <div className="text-[#FAAD14] text-xs bg-[#FAAD141A] rounded-lg flex justify-center w-fit px-2 py-1">
          Pending
        </div>
      ),
    Action: (
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-bprimary bg-[#E353141A] hover:bg-[#E3531433] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2">
              View
            </button>
          </DialogTrigger>
          <ViewExpertApplicantDetails id={entry?.id} />
        </Dialog>
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
                className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <button className="text-[#FF4D4F] bg-[#FF4D4F1A] hover:bg-[#FF4D4F33] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2">
          Cancel
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <h1 className="text-[#2D2D2D] text-2xl font-semibold">
        Expert Applications
      </h1>
      <DataTable
        title="Expert List"
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

export default ExpertApplications;
