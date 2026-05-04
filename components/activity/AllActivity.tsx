"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoData from "../Common/NoData";
import { useState } from "react";
import Pagination from "../Common/Pagination";
import {
  useDeleteActivityMutation,
  useGetAllActivityQuery,
} from "@/redux/api/reviewApi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AllActivity = () => {
  const [page, setPage] = useState(1);
  const [deleteActivity, { isLoading: isDeleteLoading }] =
    useDeleteActivityMutation();

  const { data: users, isLoading, isFetching } = useGetAllActivityQuery(page);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteActivity(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
    }
  };

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Activity List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              Admin Details
            </TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.activities?.length > 0 ? (
            users.result.activities.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.admin?.profileImage ||
                            "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                          }
                          alt={user?.admin?.name}
                        />
                        <AvatarFallback>{user?.admin.name}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.admin.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell> {user?.work}</TableCell>

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
                      <Trash2 className="text-red-500 cursor-pointer"></Trash2>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Activity"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.activities?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllActivity;
