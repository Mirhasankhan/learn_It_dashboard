"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetExpertDetailsQuery } from "@/redux/api/expertApi";
import { SaudiRiyal } from "lucide-react";

interface ExpertDetailsModalProps {
  userId: string;
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ExpertDetailsModal = ({ userId }: ExpertDetailsModalProps) => {
  const { data, isLoading } = useGetExpertDetailsQuery(userId);

  const expert = data?.result?.expert;
  const profile = expert?.ExpertProfile?.[0]; 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-50 text-xs text-blue-500 px-6 py-2 rounded-[6px] cursor-pointer">
          View
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[680px] overflow-auto bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Expert Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Loading...</p>
        ) : !expert ? (
          <p>No data found</p>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {/* Intro Video */}
            {profile?.introVideo && (
              <div className="w-full h-[300px] rounded-md overflow-hidden bg-black">
                <video
                  src={profile.introVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="flex mt-4 justify-between">
              <span className="font-medium">Name</span>
              <span>{expert.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone Number</span>
              <span>{expert.phoneNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Rating</span>
              <span>
                {expert.avgRating} ⭐ ({expert.totalReview})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Experience</span>
              <span>{profile?.experience} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Start Date</span>
              <span>
                {new Date(expert?.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* About */}
            <div>
              <h3 className="font-medium mb-1">About</h3>
              <p className="text-sm text-gray-600">{profile?.about || "-"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Targeted Industry</h3>
              <p className="text-sm text-gray-600">
                {profile?.targetIndustry?.map((t: any) => (
                  <p key={t}>{t} |</p>
                ))}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-medium text-bprimary mb-2">Experience</h3>
              <div className="space-y-2">
                {expert.Experience?.length ? (
                  expert.Experience.map((exp: any, idx: number) => (
                    <div key={idx} className="border rounded p-3">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm">{exp.companyName}</p>
                      <p className="text-xs text-gray-500">{exp.duration}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No experience listed</p>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-medium text-bprimary mb-2">Services</h3>
              <div className="space-y-2">
                {expert.Service?.length ? (
                  expert.Service.map((service: any) => (
                    <div key={service.id} className="border rounded p-3">
                      <p className="font-medium">{service.serviceName}</p>
                      <p className="text-sm text-gray-600">{service.about}</p>
                      <p className="text-sm font-semibold mt-1 flex gap-1 items-center">
                        <SaudiRiyal size={18}></SaudiRiyal> {service.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No services available</p>
                )}
              </div>
            </div>

            {/* Availability with start/end */}
            <div>
              <h3 className="font-medium text-bprimary mb-2">Availability</h3>
              <div className="space-y-1 text-sm">
                {expert.Availability?.length ? (
                  expert.Availability.map((day: any, idx: number) => (
                    <div key={idx}>
                      <span className="font-medium">
                        {weekdays[day.dayOfWeek]}:
                      </span>{" "}
                      {day.slots.map((slot: any, i: number) => (
                        <span key={i}>
                          {slot.startTime} - {slot.endTime}
                          {i < day.slots.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No availability set</p>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <h3 className="font-medium text-bprimary mb-2">Certificates</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.certificates?.length ? (
                  profile.certificates.map((certUrl: string, idx: number) => (
                    <a
                      key={idx}
                      href={certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      Certificate {idx + 1}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No certificates uploaded
                  </p>
                )}
              </div>
            </div>

            {/* CV */}
            {expert.cvUrl && (
              <div>
                <h3 className="font-medium mb-2">CV</h3>
                <div className="border rounded p-2 h-60 overflow-auto">
                  <iframe
                    src={expert.cvUrl}
                    className="w-full h-full"
                    title="Expert CV"
                  />
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="pt-3 border-t space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Report Submitted</span>
                <span>{data?.result?.reportCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Sessions Conducted</span>
                <span>{expert.sessionConductCount || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Orders Delivered</span>
                <span>{data?.result?.orderDeliveredCount || 0}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailsModal;
