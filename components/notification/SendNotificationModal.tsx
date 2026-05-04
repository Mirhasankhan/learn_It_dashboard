"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllUsersQuery } from "@/redux/api/expertApi";
import { useSendNotificationMutation } from "@/redux/api/notificationApi";
import { toast } from "sonner";

const receivers = ["AllUsers", "Seekers", "Experts", "SingleUser"] as const;

type Receiver = (typeof receivers)[number];

const SendNotificationModal = () => {
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState<Receiver>("AllUsers");
  const [userId, setUserId] = useState<string>("");
  const { data: users } = useGetAllUsersQuery("");

  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const handleSend = async () => {
    if (!content.trim()) return;
    if (receiver === "SingleUser" && !userId) return;

    const data =
      receiver === "SingleUser"
        ? { content, receiver, userId }
        : { content, receiver };

    const response: any = await sendNotification(data);
    if (response.data) {
      setContent("");
      setReceiver("AllUsers");
      setUserId("");
      toast.success("Notification sent successfully");
    } else {
      toast.error(response.error.data.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border-bprimary cursor-pointer border px-4 py-2 rounded-lg text-bprimary font-medium">
          Send Notification
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Content */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-1">
              Notification Content
            </label>
            <Textarea
              placeholder="Write notification content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Select Receiver</label>
            <Select
              value={receiver}
              onValueChange={(value) => {
                setReceiver(value as Receiver);
                if (value !== "SingleUser") setUserId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select receiver" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {receiver === "SingleUser" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Select User</label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {users?.result?.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.profileImage ?? undefined} />
                          <AvatarFallback>
                            {user.userName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.userName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action */}
          <button
            className="mt-2 bg-bprimary cursor-pointer disabled:bg-gray-400 text-white py-2 rounded-lg"
            disabled={!content.trim() || (receiver === "SingleUser" && !userId)}
            onClick={handleSend}
          >
            {isLoading ? "Sending" : "Send"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationModal;
