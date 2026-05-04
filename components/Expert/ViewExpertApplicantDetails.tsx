/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { DialogClose, DialogContent } from "../ui/dialog";
import { SyncLoader } from "react-spinners";
import { useGetExpertDetailsQuery } from "@/redux/api/expertApi";
import Image from "next/image";

const ViewExpertApplicantDetails = ({ id }: { id: string }) => {
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

  // 🟧 Extracting and fallback values
  const expert = data.result.expert ?? {};
  const basicProfile = expert.ExpertProfile?.[0] ?? {};

  const profileImage = expert.profileImage ?? "/default-user.png";
  const userName = expert.userName ?? "Not Provided";
  const avgRating = expert.avgRating ?? 0;
  const totalReview = expert.totalReview ?? 0;

  const experienceYears = basicProfile.experience ?? "N/A";
  const about = basicProfile.about ?? "No description provided.";
  const introVideo = basicProfile.introVideo ?? null;

  const certificates = basicProfile.certificates ?? [];
  const targetIndustry = basicProfile.targetIndustry ?? [];

  const services = expert.Service ?? [];
  const availability = expert.Availability ?? [];

  return (
    <DialogContent className="p-6 md:p-10 rounded-xl max-w-xs md:max-w-2xl max-h-[75vh] overflow-y-auto mx-auto md:mx-0">
      <DialogClose ref={closeRef} className="hidden" />

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Image
          src={profileImage}
          alt={userName}
          height={100}
          width={100}
          className="w-20 h-20 rounded-full object-cover border"
          priority
        />
        <div>
          <h2 className="text-xl font-semibold">{userName}</h2>
          <p className="text-gray-600 text-sm">
            ⭐ {avgRating} / 5 ({totalReview} reviews)
          </p>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">About</h3>
        <p className="text-gray-700 mt-2">{about}</p>
      </div>

      {/* EXPERIENCE */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Experience</h3>
        <p className="text-gray-700 mt-1">{experienceYears} Years</p>
      </div>

      {/* INTRO VIDEO */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Intro Video</h3>
        {introVideo ? (
          <video src={introVideo} controls className="w-full rounded-lg mt-2" />
        ) : (
          <p className="text-gray-500 mt-2">No video uploaded.</p>
        )}
      </div>

      {/* CERTIFICATES */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Certificates</h3>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {certificates.length > 0 ? (
            certificates.map((cert: string, i: number) => (
              <Image
                key={i}
                src={cert}
                alt="certificate"
                height={100}
                width={100}
                className="w-full h-28 object-cover rounded-md border"
                priority
              />
            ))
          ) : (
            <p className="text-gray-500">No certificates uploaded.</p>
          )}
        </div>
      </div>

      {/* TARGET INDUSTRY */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Target Industry</h3>
        <div className="flex gap-2 flex-wrap mt-2">
          {targetIndustry.length > 0 ? (
            targetIndustry.map((item: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No industries defined.</p>
          )}
        </div>
      </div>

      {/* SERVICES */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Services</h3>
        <div className="mt-3 space-y-4">
          {services.length > 0 ? (
            services.map((srv: any) => (
              <div key={srv.id} className="p-4 border rounded-lg flex gap-4">
                <Image
                  src={srv.serviceImage}
                  alt="service"
                  height={100}
                  width={100}
                  className="w-20 h-20 rounded-md object-cover"
                  priority
                />
                <div>
                  <h4 className="text-md font-semibold">{srv.serviceName}</h4>
                  <p className="text-gray-600 text-sm">{srv.about}</p>
                  <p className="mt-1 font-medium">Price: {srv.price} SAR</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No services available.</p>
          )}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Availability</h3>

        {availability.length > 0 ? (
          <div className="mt-2 space-y-4">
            {availability.map((day: any, i: number) => (
              <div key={i} className="border rounded-md p-3">
                <p className="font-medium">
                  Day:{" "}
                  {
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      day.dayOfWeek
                    ]
                  }
                </p>

                <div className="mt-2 space-y-1">
                  {day.slots?.map((slot: any, j: number) => (
                    <p key={j} className="text-gray-700">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No availability added.</p>
        )}
      </div>
    </DialogContent>
  );
};

export default ViewExpertApplicantDetails;
