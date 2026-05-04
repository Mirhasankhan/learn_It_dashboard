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
import { useGetAllFeedbacksQuery } from "@/redux/api/reviewApi";

const AllFeedbacks = () => {
  const [page, setPage] = useState(1);

  const { data: users, isLoading, isFetching } = useGetAllFeedbacksQuery(page);

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Feedback List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[200px] whitespace-nowrap">
              Job Seeker
            </TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Management</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Professionalism</TableHead>
            <TableHead>Speaking</TableHead>
            <TableHead>Technique</TableHead>
            <TableHead>Thinking</TableHead>
            <TableHead>Overall</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.reviews?.length > 0 ? (
            users.result.reviews.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.seeker?.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.seeker?.uniqueId}
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
                    <div className="flex gap-1 items-center">
                      <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                      <h1>{user.management}</h1>
                    </div>
                  </TableCell>

                  <TableCell>
                    {user.confidence ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.confidence}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user.professionalism ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.professionalism}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user.speaking ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.speaking}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user.technique ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.technique}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user.thinking ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.thinking}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user?.overall ? (
                      <div className="flex gap-1 items-center">
                        <FaStar size={18} className="text-[#FAAD14]"></FaStar>
                        <h1>{user.overall}</h1>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{user?.comment}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Feedback"
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

export default AllFeedbacks;
