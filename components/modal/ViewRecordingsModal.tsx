"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ViewRecordingsModal = ({ recordings }: any) => {
  if (recordings.length < 1) {
    return (
      <button className="cursor-not-allowed bg-gray-50 text-gray-700  px-4 py-2 rounded-[6px]">
        No Recordings
      </button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          // disabled={recordings.length < 1}
          className="bg-bprimary/10 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 text-bprimary px-4 py-2 rounded-[6px]"
        >
          View Recordings
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle>Recordings Details</DialogTitle>
        </DialogHeader>

        {/* User Recording Section */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">User Recording</h2>

          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="text-gray-600">Joined At:</span>
              <p className="font-medium">
                {recordings?.[0]?.userJoinedAt
                  ? new Date(recordings[0].userJoinedAt).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      },
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Left At:</span>
              <p className="font-medium">
                {recordings?.[0]?.userLeftAt
                  ? new Date(recordings[0].userLeftAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <video
              src={recordings?.[0]?.userfileUrl}
              controls
              className="w-full rounded-xl h-full object-cover"
            />
          </div>
        </div>

        {/* Expert Recording Section */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Expert Recording</h2>

          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="text-gray-600">Joined At:</span>
              <p className="font-medium">
                {recordings?.[0]?.expertJoinedAt
                  ? new Date(recordings[0].expertJoinedAt).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      },
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Left At:</span>
              <p className="font-medium">
                {recordings?.[0]?.expertLeftAt
                  ? new Date(recordings[0].expertLeftAt).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      },
                    )
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <video
              src={recordings?.[0]?.expertfileUrl}
              controls
              className="w-full rounded-xl h-full object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRecordingsModal;
