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
import { useGetAllSessionsQuery } from "@/redux/api/sessionApi";
import ViewRecordingsModal from "../modal/ViewRecordingsModal";
import { RotateCw, SaudiRiyal } from "lucide-react";

const AllSessions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllSessionsQuery({ page, status, searchTerm });

  const totalPage = users?.result?.meta?.totalPages;

  console.log(users?.result);

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">Session List</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 rounded-lg py-1 flex-1 md:flex-none"
            placeholder="search by id, expert or seeker.."
            type="text"
          />
          <select
            className="border rounded-md px-2 py-1 flex-1 md:flex-none"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="In_Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Resolved_In_Dispute">Dispute</option>
          </select>
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
            <TableHead>Session ID</TableHead>
            <TableHead>Seeker Name</TableHead>
            <TableHead>Expert Name</TableHead>
            <TableHead className="w-[150px] whitespace-nowrap">
              Session Type
            </TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.sessions?.length > 0 ? (
            users.result.sessions.map((user: any) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user?.orderId}</TableCell>

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
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                      {user.service.serviceType == "Career"
                        ? "Career Consultation"
                        : "Mock Interview"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <SaudiRiyal size={15} /> {user?.price} /=
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(user?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",

                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>{user?.startTime}</TableCell>
                  <TableCell>
                    {user?.paymentMethod == "Free Session"
                      ? "Credit Used"
                      : user?.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <p
                      className={`${
                        user.status == "In_Progress"
                          ? "bg-blue-200 text-blue-600"
                          : user.status == "Resolved_In_Dispute"
                            ? "bg-orange-50 text-orange-500"
                            : user.status == "Completed"
                              ? "bg-green-50 text-green-400"
                              : "bg-red-50 text-red-500"
                      } px-2 py-1 rounded-sm inline-block`}
                    >
                      {user.status == "In_Progress"
                        ? "In Progress"
                        : user.status == "Resolved_In_Dispute"
                          ? "Resolved In Dispute"
                          : user.status}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 ">
                      {/* <button className="bg-green-50 px-3 rounded-[6px] text-green-600">View Details</button> */}
                      <div>
                        <ViewRecordingsModal
                          recordings={user?.recordings}
                        ></ViewRecordingsModal>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Session"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.sessions?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllSessions;
