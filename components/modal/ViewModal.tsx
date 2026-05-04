"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetJobSeekersDetailsQuery } from "@/redux/api/jobSeekerApi";

interface JobSeekerDetailsModalProps {
  userId: string;
}

const JobSeekerDetailsModal = ({ userId }: JobSeekerDetailsModalProps) => {
  const { data, isLoading } = useGetJobSeekersDetailsQuery(userId);
 
  const jobSeeker = data?.result?.jobSeeker;
  const profile = jobSeeker?.UserProfile?.[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-green-50 text-xs cursor-pointer  text-green-400 px-6 py-2 rounded-[6px]">
          View
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg bg-white"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle>Job Seeker Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Loading...</p>
        ) : !jobSeeker ? (
          <p>No data found</p>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{jobSeeker.userName}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{jobSeeker.phoneNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Experience:</span>
              <span>{profile?.experience || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Join Date:</span>
              <span>
                {new Date(jobSeeker.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Sessions Conducted:</span>
              <span>{data?.result?.sessionBookingCount || 0}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Services Ordered:</span>
              <span>{data?.result?.orderBookingCount || 0}</span>
            </div>

            {/* CV Section */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">CV</h3>
              <div className="border rounded p-2 h-60 overflow-auto">
                <iframe
                  src={jobSeeker.cvUrl}
                  className="w-full h-full"
                  title="Job Seeker CV"
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobSeekerDetailsModal;
