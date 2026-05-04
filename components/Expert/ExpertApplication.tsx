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
import { format } from "date-fns";
import {
  useAcceptUserMutation,
  useGetAllExpertApplicationsQuery,
} from "@/redux/api/expertApi";
import { useDeleteUserMutation } from "@/redux/api/jobSeekerApi";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";

const ExpertApplications = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [DeleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [acceptUser, { isLoading: isAccepting }] = useAcceptUserMutation();
  // 🔑 Track which row is being acted on

  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllExpertApplicationsQuery({ page, searchTerm });

  const totalPage = users?.result?.meta?.totalPages;

  const handleAccept = async (id: string) => {
    try {
      const response = await acceptUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await DeleteUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Application List</h1>
        <div className="flex gap-2">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 rounded-lg py-1"
            placeholder="search"
            type="text"
          />
          <button
            onClick={() => window.location.reload()}
            className="border flex items-center gap-1 px-4 text-gray-600 rounded-[6px] cursor-pointer py-1"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Expert ID</TableHead>
            <TableHead className="w-[200px] whitespace-nowrap">Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Apply Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.experts?.length > 0 ? (
            users.result.experts.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user?.uniqueId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={user?.userName}
                        />
                        <AvatarFallback>{user?.userName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.userName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{user?.phoneNumber}</TableCell>

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

                  <TableCell>{user.status}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(user.id)}
                        disabled={isAccepting}
                        className="bg-green-50 cursor-pointer text-green-500 px-4 py-2 rounded-[6px]"
                      >
                        {isAccepting ? "Accepting.." : "Accept"}
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-50 cursor-pointer text-red-500 px-4 py-2 rounded-[6px]"
                      >
                        {isDeleting ? "Rejecting.." : "Reject"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Application"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.experts?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default ExpertApplications;
