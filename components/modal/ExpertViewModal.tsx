"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetExpertDetailsQuery } from "@/redux/api/expertApi";
import { SaudiRiyal, Eye } from "lucide-react";

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
          <DialogTitle className="text-xl">Expert Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : !expert ? (
          <p className="text-center py-8 text-gray-500">No data found</p>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Intro Video */}
            {profile?.introVideo && (
              <div className="w-full h-[280px] rounded-lg overflow-hidden bg-black shadow-sm">
                <video
                  src={profile.introVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info Card */}
            <div className="bg-linear-to-r from-blue-50 to-transparent rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Name</span>
                <span className="font-semibold text-gray-900">
                  {expert.userName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Phone</span>
                <span className="text-gray-900">{expert.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Rating</span>
                <span className="font-semibold">
                  {expert.avgRating} ⭐ ({expert.totalReview})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Experience</span>
                <span className="text-gray-900">
                  {profile?.experience} Years
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Joined</span>
                <span className="text-gray-900">
                  {new Date(expert?.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {profile?.about || "-"}
              </p>
            </div>

            {/* Targeted Industry */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Targeted Industry</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.targetIndustry?.length ? (
                  profile.targetIndustry.map((t: any) => (
                    <span
                      key={t}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">-</p>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Experience</h3>
              <div className="space-y-2">
                {expert.Experience?.length ? (
                  expert.Experience.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <p className="font-semibold text-gray-900">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exp.duration}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No experience listed</p>
                )}
              </div>
            </div>

            {/* Services Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Services</h3>
              <div className="space-y-2">
                {expert.Service?.length ? (
                  expert.Service.map((service: any) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-bprimary transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {service.serviceName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {service.about}
                          </p>
                        </div>
                        <p className="font-semibold text-bprimary flex gap-1 items-center whitespace-nowrap ml-2">
                          <SaudiRiyal size={16}></SaudiRiyal> {service.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No services available</p>
                )}
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Availability</h3>
              <div className="space-y-2 text-sm">
                {expert.Availability?.length ? (
                  expert.Availability.map((day: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start bg-gray-50 rounded-lg p-3"
                    >
                      <span className="font-medium text-gray-900 min-w-24">
                        {weekdays[day.dayOfWeek]}
                      </span>
                      <span className="text-gray-600">
                        {day.slots.map((slot: any, i: number) => (
                          <span key={i}>
                            {slot.startTime} - {slot.endTime}
                            {i < day.slots.length - 1 ? " | " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No availability set</p>
                )}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Certificates</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.certificates?.length ? (
                  profile.certificates.map((certUrl: string, idx: number) => (
                    <a
                      key={idx}
                      href={certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <Eye size={16} />
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

            {/* CV Section */}
            {expert.cvUrl && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">CV</h3>
                <div className="border border-gray-200 rounded-lg p-2 h-60 overflow-auto shadow-sm">
                  <iframe
                    src={expert.cvUrl}
                    className="w-full h-full"
                    title="Expert CV"
                  />
                </div>
              </div>
            )}

            {/* Metrics Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Statistics</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Report Submitted</span>
                <span className="font-semibold text-gray-900">
                  {data?.result?.reportCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sessions Conducted</span>
                <span className="font-semibold text-gray-900">
                  {expert.sessionConductCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders Delivered</span>
                <span className="font-semibold text-gray-900">
                  {data?.result?.orderDeliveredCount || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailsModal;
