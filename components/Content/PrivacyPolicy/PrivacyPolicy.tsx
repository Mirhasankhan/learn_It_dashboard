/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import DOMPurify from "dompurify";
import "../../Common/MYTextEditor.css";
import { TbEdit } from "react-icons/tb";
import { SyncLoader } from "react-spinners";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useGetAllPrivacyPolicyQuery } from "@/redux/api/contentApi";
import EditPrivacyPolicyModal from "./EditPrivacyPolicyModal";

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetAllPrivacyPolicyQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-4 my-10">
        <span className="text-bprimary">Privacy Policy is Loading</span>
        <SyncLoader color="#E35314" size={12} />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {data?.result?.map((terms: any, idx: number) => (
        <div key={idx} className="relative">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] pb-6">
            Privacy Policy
          </h1>

          <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(terms?.content),
            }}
          />

          {/* Edit Button */}
          <Dialog>
            <DialogTrigger asChild className="absolute top-24 right-4">
              <button
                type="button"
                className="hover:bg-gray-200 rounded-lg p-2 transition-all duration-300 cursor-pointer disabled:opacity-70"
              >
                <TbEdit color="#64748B" size={24} />
              </button>
            </DialogTrigger>
            <EditPrivacyPolicyModal id={terms.id} />
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
