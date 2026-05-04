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
import {
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetAllJobSeekersQuery,
  useUnsuspendUserMutation,
} from "@/redux/api/jobSeekerApi";
import { useState } from "react";
import Pagination from "../Common/Pagination";
import { toast } from "sonner";
import { format } from "date-fns";
import SuspendUserModal from "../modal/SuspendModal";
import JobSeekerDetailsModal from "../modal/ViewModal";
import { RotateCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { se } from "date-fns/locale";

const AllJobSeekers = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");

  const [DeleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [unsuspend, { isLoading: isUnsuspending }] = useUnsuspendUserMutation();
  const [DeactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData);

  // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllJobSeekersQuery({ page, searchTerm: searchTerm || "" });

  const totalPage = users?.result?.meta?.totalPages;

  const handleDelete = async (id: string) => {
    try {
      setActiveUserId(id);
      const response = await DeleteUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
      setActiveUserId(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      setActiveUserId(id);
      const response = await DeactivateUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
      setActiveUserId(null);
    }
  };

  const handleUnsuspend = async (id: string) => {
    try {
      setActiveUserId(id);
      const response = await unsuspend(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
      setActiveUserId(null);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Job Seeker List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by id, name or phone.."
            type="text"
          />
          <button
            onClick={() => window.location.reload()}
            className="border flex items-center justify-center gap-1 px-4 text-gray-600 rounded-[6px] cursor-pointer py-1 md:justify-start"
          >
            Refresh <RotateCw size={15}></RotateCw>
          </button>
        </div>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Job Seeker ID</TableHead>
            <TableHead className="w-[250px] whitespace-nowrap">Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Subscription Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.jobSeekers?.length > 0 ? (
            users.result.jobSeekers.map((user: any) => {
              const isCurrent = activeUserId === user.id;

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

                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        user?.subscriptionType === "Free"
                          ? "bg-gray-50 text-gray-600"
                          : user?.subscriptionType === "Weekly"
                            ? "bg-blue-50 text-blue-600"
                            : user?.subscriptionType === "Monthly"
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {user?.subscriptionType === "Free"
                        ? "Free Plan"
                        : user?.subscriptionType === "Weekly"
                          ? "Weekly Plan"
                          : user?.subscriptionType === "Monthly"
                            ? "Monthly Plan"
                            : "3 Days Plan"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {user?.suspendUntil &&
                    new Date(user.suspendUntil) > new Date() ? (
                      <p className="text-red-500">
                        Suspended till (
                        {format(new Date(user.suspendUntil), "dd MMM yyyy")})
                      </p>
                    ) : (
                      user?.status
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <JobSeekerDetailsModal userId={user.id} />

                      {/* Activate / Deactivate */}
                      {user.status === "DEACTIVATE" ? (
                        <button
                          disabled={isDeactivating && isCurrent}
                          onClick={() => handleDeactivate(user.id)}
                          className="bg-purple-100 text-xs text-purple-600 px-6 py-1 rounded-[6px]"
                        >
                          {isDeactivating && isCurrent
                            ? "Activating.."
                            : "Activate"}
                        </button>
                      ) : (
                        <button
                          disabled={
                            (isDeactivating && isCurrent) ||
                            new Date(user.suspendUntil) > new Date()
                          }
                          onClick={() => handleDeactivate(user.id)}
                          className="bg-red-100 text-xs disabled:cursor-not-allowed text-red-600 px-6 py-1 rounded-[6px]"
                        >
                          {isDeactivating && isCurrent
                            ? "Deactivating.."
                            : "Deactivate"}
                        </button>
                      )}

                      {/* Suspend / Unsuspend */}
                      {new Date(user.suspendUntil) > new Date() ? (
                        <button
                          disabled={isUnsuspending && isCurrent}
                          onClick={() => handleUnsuspend(user.id)}
                          className="bg-purple-50 text-xs text-purple-400 px-6 py-1 rounded-[6px]"
                        >
                          {isUnsuspending && isCurrent
                            ? "Unsuspending.."
                            : "Unsuspend"}
                        </button>
                      ) : (
                        <SuspendUserModal
                          isDisabled={user.status === "DEACTIVATE"}
                          userId={user.id}
                        />
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting && isCurrent}
                        className="bg-red-50 text-xs text-red-400 px-6 py-1 rounded-[6px]"
                      >
                        {isDeleting && isCurrent ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Job Seeker"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.jobSeekers?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllJobSeekers;
