"use client";

import React, { useRef } from "react";
import { DialogClose, DialogContent } from "../ui/dialog";
import { useGetJobSeekersDetailsQuery } from "@/redux/api/jobSeekerApi";
import { SyncLoader } from "react-spinners";
import Link from "next/link";

const ViewJobSeekerDetailsModal = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { data, isLoading } = useGetJobSeekersDetailsQuery(id);

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
        )
    }

    const job = data?.result?.jobSeeker ?? {};

    const experience =
        job?.UserProfile?.[0]?.experience && job?.UserProfile?.[0]?.experience !== ""
            ? job?.UserProfile?.[0]?.experience
            : "N/A";

    const joinDate =
        job?.createdAt && job?.createdAt !== ""
            ? new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
            : "N/A";

    const cvFileName =
        job?.cvUrl && job.cvUrl !== ""
            ? job.cvUrl.split("/").pop()
            : "No CV Uploaded";

    // Safe defaults for counters
    const sessions = data?.result?.sessionBookingCount ?? 0;
    const orders = data?.result?.orderBookingCount ?? 0;
    const reports = data?.result?.orderBookingCount ?? 0;

    return (
        <DialogContent className="p-10 rounded-xl max-w-sm md:max-w-lg max-h-[75vh] overflow-y-auto">
            <DialogClose ref={closeRef} className="hidden" />

            {/* Title */}
            <h2 className="text-center text-[#2D2D2D] text-2xl md:text-3xl font-semibold mb-4 md:mb-10">
                Job Seekers Details
            </h2>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-4">

                <p className="text-[#2D2D2D] text-sm md:text-base">Job Seeker Name</p>
                <p className="font-medium text-right text-sm md:text-lg">
                    {job?.userName || "N/A"}
                </p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Phone Number</p>
                <p className="font-medium text-right text-sm md:text-lg">
                    {job?.phoneNumber || "N/A"}
                </p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Experience</p>
                <p className="font-medium text-right text-sm md:text-lg">{experience}</p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Join Date</p>
                <p className="font-medium text-right text-sm md:text-lg">{joinDate}</p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Sessions Conducted</p>
                <p className="font-medium text-right text-sm md:text-lg">{sessions}</p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Services Ordered</p>
                <p className="font-medium text-right text-sm md:text-lg">{orders}</p>

                <p className="text-[#2D2D2D] text-sm md:text-base">Reports Submitted</p>
                <p className="font-medium text-right text-sm md:text-lg">{reports}</p>
            </div>

            {/* Documents Section */}
            <p className="text-[#2D2D2D] text-sm md:text-base">Documents</p>
            <Link href={job?.cvUrl} target="_blank" className="border border-[#D1D6DB] rounded-xl cursor-pointer p-4">
                <p className="text-[#2D2D2D] text-sm font-medium text-center">CV File Name</p>
                <p className="text-[#636F85] text-center text-xs mt-2">{cvFileName}</p>
            </Link>

            {/* Close Button */}
            <div className="flex justify-end mt-3">
                <button onClick={() => closeRef.current?.click()} className="border border-bprimary text-bprimary font-semibold rounded-lg transition-all duration-500 ease-in-out cursor-pointer hover:bg-[#E353141A] px-6 py-2">Close</button>
            </div>
        </DialogContent>
    );
};

export default ViewJobSeekerDetailsModal;