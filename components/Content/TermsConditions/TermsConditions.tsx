/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DOMPurify from "dompurify";
import "../../Common/MYTextEditor.css";
import { SyncLoader } from "react-spinners";
import { useGetAllTermsAndConditionsQuery } from "@/redux/api/contentApi";
import { TbEdit } from "react-icons/tb";
import { Dialog, DialogTrigger } from "../../ui/dialog";
import EditTermsConditionsModal from "./EditTermsConditionsModal";

const TermsConditions = () => {
  const { data, isLoading } = useGetAllTermsAndConditionsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-4 my-10">
        <span className="text-bprimary">Terms & Conditions is Loading</span>
        <SyncLoader color="#E35314" size={12} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data?.result?.map((terms: any, idx: number) => (
        <div key={idx} className="relative">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] pb-6">
            {terms?.key === "User"
              ? "Job Seeker Terms & Conditions"
              : "Career Expert Terms & Conditions"}
          </h1>

          <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(terms?.content),
            }}
          />

          <Dialog>
            <DialogTrigger
              asChild
              className="absolute top-32 md:top-24 right-4"
            >
              <button
                type="button"
                className="hover:bg-gray-200 rounded-lg p-2 transition-all duration-300 cursor-pointer disabled:opacity-70"
              >
                <TbEdit color="#64748B" size={24} />
              </button>
            </DialogTrigger>
            <EditTermsConditionsModal id={terms.id} />
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default TermsConditions;
