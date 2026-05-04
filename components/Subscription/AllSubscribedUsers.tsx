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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetAllSubscribersQuery } from "@/redux/api/subscriptionApi";

const AllSubscribedUsers = () => {
  const [page, setPage] = useState(1);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllSubscribersQuery(page);

  const totalPage = users?.result?.meta?.totalPages;

  return (
    <div className="p-5 mb-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:font-medium">Subscriber List</h1>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[200px] whitespace-nowrap">
              Subscriber Details
            </TableHead>

            <TableHead>Phone Number</TableHead>
            <TableHead>Subscription Type</TableHead>
            <TableHead>Subscribed From</TableHead>
            <TableHead>Next Payment</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.subscribers?.length > 0 ? (
            users.result.subscribers.map((user: any) => {
              return (
                <TableRow key={user.id}>
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
                        {user?.userName} <br />
                        <span className="text-xs text-gray-600 font-normal">
                          {user?.role}
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{user?.phoneNumber}</TableCell>

                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        (user?.userSubscription?.type ||
                          user?.expertSubscription?.type) === "Weekly"
                          ? "bg-blue-50 text-blue-600"
                          : (user?.userSubscription?.type ||
                                user?.expertSubscription?.type) === "Monthly"
                            ? "bg-green-50 text-green-600"
                            : (user?.userSubscription?.type ||
                                  user?.expertSubscription?.type) === "Yearly"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {(user?.userSubscription?.type ||
                        user?.expertSubscription?.type) === "Weekly"
                        ? "Weekly Plan"
                        : (user?.userSubscription?.type ||
                              user?.expertSubscription?.type) === "Monthly"
                          ? "Monthly Plan"
                          : (user?.userSubscription?.type ||
                                user?.expertSubscription?.type) === "Yearly"
                            ? "Yearly Plan"
                            : "3 Days Plan"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(
                      user?.userSubscription
                        ? user?.userSubscription?.createdAt
                        : user?.expertSubscription?.createdAt,
                    ).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      user?.userSubscription
                        ? user?.userSubscription?.nextPayment
                        : user?.expertSubscription?.nextPayment,
                    ).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Subscribed User"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>

      {users?.result?.subscribers?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllSubscribedUsers;
