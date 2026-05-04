"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import NoData from "../Common/NoData";
import { useState } from "react";
import Pagination from "../Common/Pagination";
import {
  useAdminNotificationsQuery,
  useDeleteNotificationMutation,
} from "@/redux/api/notificationApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AllNotifications = () => {
  const [page, setPage] = useState(1);
  const [deleteNotification, { isLoading: isDeleteLoading }] =
    useDeleteNotificationMutation();

  // 🔑 Track which row is being acted on

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAdminNotificationsQuery(page);

  const totalPage = users?.result?.meta?.totalPages;

  const handleDelete = async (id: string) => {
    const response = await deleteNotification(id).unwrap();
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.error.message);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Notification List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Receiver Type
            </TableHead>
            <TableHead>Receiver Details</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.adminNotifications?.length > 0 ? (
            users.result.adminNotifications.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {user?.receiver == "Seekers"
                      ? "Job Seekers"
                      : user?.receiver == "SingleUser"
                        ? "Individual"
                        : user?.receiver == "Experts"
                          ? "Experts"
                          : "All Users"}
                  </TableCell>
                  <TableCell>
                    {user?.receiver == "SingleUser" ? (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user?.user?.profileImage ||
                              "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                            }
                            alt={user?.user?.userName}
                          />
                          <AvatarFallback>
                            {user?.user?.userName}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">
                          {user?.user?.userName}
                        </span>
                      </div>
                    ) : (
                      "-----"
                    )}
                  </TableCell>
                  <TableCell>{user?.content}</TableCell>
                  <TableCell>
                    {new Date(user?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>

                  <TableCell>
                    <button
                      disabled={isDeleteLoading}
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="text-red-400 cursor-pointer"></Trash2>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Notification"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.adminNotifications?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllNotifications;
