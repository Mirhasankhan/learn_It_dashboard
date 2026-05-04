"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobSeekerDetailsModalProps {
  userName: string;
  role: string;
  profileImage: string;
  phoneNumber: string;
  uniqueId: string;
}

const UserDetailsModal = ({
  userName,
  role,
  profileImage,
  phoneNumber,
  uniqueId,
}: JobSeekerDetailsModalProps) => {
  const router = useRouter();

  const handleRedirect = async () => {
    router.push(
      `${role == "USER" ? "job-seeker-management" : "expert-management"}?searchData=${uniqueId}`,
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-8 h-8 cursor-pointer rounded-full overflow-hidden border">
          <img
            src={
              profileImage ||
              "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
            }
            alt="user"
            className="object-cover w-full h-full"
          />
        </div>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-sm bg-white"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle>
            {role == "USER" ? "Job Seeker" : "Career Expert"} Info
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center gap-2">
            <img
              src={profileImage}
              alt="user"
              className="object-cover border border-yellow-200 w-16 rounded-full h-16"
            />
            <div>
              <h1>{userName}</h1>
              <h1 className="text-gray-700 text-sm">ID: {uniqueId}</h1>
            </div>
          </div>
          <div className="flex my-5 items-center gap-2 text-gray-700">
            <Phone size={17}></Phone>
            <p>{phoneNumber}</p>
          </div>
          <button
            onClick={() => handleRedirect()}
            className="bg-bprimary text-white cursor-pointer w-full rounded-md  py-2"
          >
            Take Action
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
