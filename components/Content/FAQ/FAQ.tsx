/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { SyncLoader } from "react-spinners";
import {
  useDeleteFAQMutation,
  useGetAllFAQsQuery,
} from "@/redux/api/contentApi";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import AddFAQModal from "./AddFAQModal";
import EditFAQModal from "./EditFAQModal";
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
} from "@/components/ui/alert-dialog";
import { LuLoader } from "react-icons/lu";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/Common/Skeleton";

const FAQ = () => {
  const [selectedId, setSelectedId] = useState("");
  const { data, isLoading } = useGetAllFAQsQuery("User");

  const [DeleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center gap-4 my-10">
  //       <span className="text-bprimary">FAQ is Loading</span>
  //       <SyncLoader color="#E35314" size={12} />
  //     </div>
  //   );
  // }

  const handleDelete = async (id: string) => {
    try {
      const response = await DeleteFAQ(id).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.error((err as any).data.message || "Something went wrong!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-6">
        <h1 className="md:text-2xl font-semibold text-[#2D2D2D] md:pb-4">
          Job Seekers Frequently Asked Questions
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary px-6 py-3">
              + Add Users FAQ
            </Button>
          </DialogTrigger>
          <AddFAQModal faqType="User" />
        </Dialog>
      </div>

      {data?.result?.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-5">
          {data?.result?.map((terms: any, idx: number) => (
            <div
              key={idx}
              className="relative bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-8 md:p-6"
            >
              <h1 className="text-lg font-semibold text-[#2D2D2D] mb-2.5">
                {terms?.question}
              </h1>
              <p className="text-sm text-[#636F85]">{terms?.answer}</p>

              {/* Edit Button */}
              <div className="absolute bottom-0 md:top-2 right-0 md:right-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="hover:bg-gray-200 rounded-lg p-2 transition-all duration-300 cursor-pointer disabled:opacity-70"
                    >
                      <TbEdit color="#64748B" size={24} />
                    </button>
                  </DialogTrigger>
                  <EditFAQModal id={terms.id} />
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="hover:bg-gray-200 rounded-lg p-2 transition-all duration-300 cursor-pointer disabled:opacity-70">
                      {isDeleting && selectedId === terms?.id ? (
                        <div className="flex justify-center items-center gap-2">
                          <div className="animate-spin">
                            <LuLoader size={18} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <RiDeleteBin5Line color="#64748B" size={24} />
                        </div>
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="z-50">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setSelectedId(terms?.id);
                          handleDelete(terms?.id);
                        }}
                        className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonCard height={100} key={idx} />
              ))}
            </div>
          ) : (
            "No Faq Found"
          )}
        </div>
      )}
    </div>
  );
};

export default FAQ;
