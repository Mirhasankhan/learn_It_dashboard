"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaStar } from "react-icons/fa";
import NoData from "../Common/NoData";
import { useState } from "react";
import Pagination from "../Common/Pagination";
import {
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
} from "@/redux/api/reviewApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AllReviews = () => {
  const [page, setPage] = useState(1);

  const { data: users, isLoading, isFetching } = useGetAllReviewsQuery(page);
  const [deleteReview, { isLoading: isDeleteLoading }] =
    useDeleteReviewMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleDeleteReview = async (id: string) => {
    const response: any = await deleteReview(id);
    if (response.data) {
      toast.success("Review deleted successfully");
    } else {
      toast.error(response.error.data.message);
    }
  };

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Review List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>
              Order Id
            </TableHead>
            <TableHead>
              Job Seeker
            </TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.reviews?.length > 0 ? (
            users.result.reviews.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user?.booking?.orderId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.seeeker?.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.seeeker?.uniqueId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.expert?.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.expert?.uniqueId}
                      </span>
                    </div>
                  </TableCell>                 

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
                    <div className="flex gap-1 items-center">
                      <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                      <h1>{user.rating}</h1>
                    </div>
                  </TableCell>

                  <TableCell>{user?.comment}</TableCell>
                  <TableCell>
                    <button
                      disabled={isDeleteLoading}
                      onClick={() => handleDeleteReview(user.id)}
                    >
                      <Trash2 className="text-red-500 cursor-pointer"></Trash2>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Review"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.reviews?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllReviews;
