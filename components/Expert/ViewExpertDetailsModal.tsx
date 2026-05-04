/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { SyncLoader } from "react-spinners";
import { DialogClose, DialogContent } from "../ui/dialog";
import { useGetExpertDetailsQuery } from "@/redux/api/expertApi";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ViewExpertDetailsModal = ({ id }: { id: string }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, isLoading } = useGetExpertDetailsQuery(id);

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

  const expert = data?.result?.expert ?? {};

  const profile = expert?.ExpertProfile?.[0] ?? {};
  const experienceYears = profile?.experience || "N/A";
  const introVideo = profile?.introVideo || null;
  const certificates = profile?.certificates || [];
  const about = profile?.about || "No description available";
  const targetIndustries = profile?.targetIndustry || [];

  const joinDate =
    expert?.createdAt && expert?.createdAt !== ""
      ? new Date(expert.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const rating = expert?.avgRating ?? 0;
  const totalReviews = expert?.totalReview ?? 0;

  const services = expert?.Service || [];
  const experiences = expert?.Experience || [];
  const availability = expert?.Availability || [];

  return (
    <DialogContent className="p-10 rounded-xl max-w-sm md:max-w-xl max-h-[75vh] overflow-y-auto">
      <DialogClose ref={closeRef} className="hidden" />

      {/* Title */}
      <h2 className="text-center text-[#2D2D2D] text-2xl md:text-3xl font-semibold mb-4">
        Expert Details
      </h2>

      {/* -------- Header Image + Play Button -------- */}
      {introVideo && (
        <video src={introVideo} autoPlay muted className="w-full rounded-lg" />
      )}

      {/* -------- Details Grid -------- */}
      <div className="grid grid-cols-2 gap-y-4">
        <p className="text-[#2D2D2D]">Expert Name</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">
          {expert?.userName || "N/A"}
        </p>

        <p className="text-[#2D2D2D]">Expert Phone Number</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">N/A</p>

        <p className="text-[#2D2D2D]">Experience</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">
          {experienceYears} yrs
        </p>

        <p className="text-[#2D2D2D]">Familiarity</p>
        <p className="text-right text-[#636F85]">
          {targetIndustries.length > 0 ? targetIndustries.join(", ") : "N/A"}
        </p>

        <p className="text-[#2D2D2D]">Rating</p>
        <p className="text-right text-sm text-[#636F85]">
          ⭐ {rating} ({totalReviews})
        </p>

        <p className="text-[#2D2D2D]">Join Date</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">
          {joinDate}
        </p>

        <p className="text-[#2D2D2D]">Sessions Conducted</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">
          {data?.result?.sessionConductCount ?? 0}
        </p>

        <p className="text-[#2D2D2D]">Services Delivered</p>
        <p className="font-medium text-right text-lg text-[#2D2D2D]">
          {data?.result?.orderDeliveredCount ?? 0}
        </p>
      </div>

      {/* -------- About Section -------- */}
      <div className="">
        <h3 className="text-[#2D2D2D] mb-2">About Us</h3>
        <p className="text-[#636F85] text-sm border border-[#D1D6DB] rounded-lg p-4">
          {about}
        </p>
      </div>

      {/* -------- Documents Section -------- */}
      <div className="">
        <h3 className="text-[#2D2D2D] mb-2">Documents</h3>

        <div className="grid grid-cols-2 gap-3 border border-[#D1D6DB] rounded-lg p-4">
          {/* CV File (Always N/A since backend doesn't provide) */}
          <div className="">
            <p className="text-[#2D2D2D] text-sm font-medium">CV File Name</p>
            <p className="text-[#636F85] text-xs mt-2">No CV Provided</p>
          </div>

          {/* Certificates */}
          <div className="">
            <p className="text-[#2D2D2D] text-sm font-medium">
              Certificate File Name
            </p>
            <div className="text-[#636F85] text-xs mt-2 hover:underline cursor-pointer">
              {certificates.length > 0
                ? certificates?.map((certificate: string, idx: number) => (
                    <Link key={idx} href={certificate} target="_blank">
                      {certificate.split("/").pop()}
                    </Link>
                  ))
                : "No Certificate"}
            </div>
          </div>
        </div>
      </div>

      {/* -------- Schedule Section -------- */}
      <div className="">
        <h3 className="text-[#2D2D2D] mb-2">Schedule</h3>
        <div className="bg-[#F9FAFB] rounded-lg p-3">
          {availability.map((a: any, idx: number) => (
            <div key={idx} className="flex justify-between py-1">
              <span className="font-medium text-[#2D2D2D]">
                {dayNames[a.dayOfWeek] || "N/A"}
              </span>
              <span className="text-[#2D2D2D]">
                {a.slots[0]?.startTime || "N/A"} -{" "}
                {a.slots[0]?.endTime || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* -------- Services Section -------- */}
      <div className="">
        <h3 className="text-[#2D2D2D] mb-2">Services</h3>
        <div className="space-y-3">
          {services.map((s: any) => (
            <div key={s.id} className="bg-[#F9FAFB] rounded-lg p-3">
              <p className="text-[#2D2D2D] mb-2 flex justify-between">
                {s.serviceName}
                <span className="text-sm font-medium">⃁ {s.price}</span>
              </p>
              <p className="text-[#636F85] text-sm">{s.about}</p>
            </div>
          ))}
        </div>
      </div>

      {/* -------- Experience Section -------- */}
      <div className="">
        <h3 className="text-[#2D2D2D] mb-2">Experience</h3>
        <div className="space-y-3">
          {experiences.map((e: any, idx: number) => (
            <div key={idx} className="bg-[#F9FAFB] rounded-lg text-sm p-3">
              <p className="font-semibold text-[#636F85]">{e.title}</p>
              <p className="text-[#2D2D2D]">
                <span className="text-[#636F85]">Company: </span>
                {e.companyName}
              </p>
              <p className="text-[#2D2D2D]">
                <span className="text-[#636F85]">Duration: </span>
                {e.duration}
              </p>
              <p className="text-[#2D2D2D]">
                <span className="text-[#636F85]">Description: </span>
                {e.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* -------- Close Button -------- */}
      <div className="flex justify-end mt-3">
        <button
          onClick={() => closeRef.current?.click()}
          className="border border-bprimary text-bprimary font-semibold rounded-lg transition-all duration-500 ease-in-out cursor-pointer hover:bg-[#E353141A] px-6 py-2"
        >
          Close
        </button>
      </div>
    </DialogContent>
  );
};

export default ViewExpertDetailsModal;
