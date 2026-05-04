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
import { SaudiRiyal } from "lucide-react";
import { useGetExpertBookingWithdrawQuery } from "@/redux/api/expertApi";

const ExpertBookingHistory = ({ id }: { id: string }) => {
  const {
    data: bookigWithdrawData,
    isLoading,
    isFetching,
  } = useGetExpertBookingWithdrawQuery(id);

  return (
    <div>
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings Card */}
        <div className="p-6 rounded-2xl shadow-sm border bg-white">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Total Earnings
            </p>
            <div className="flex text-bprimary items-center gap-2">
              <SaudiRiyal size={20} />
              <h3 className="text-3xl font-bold ">
                {bookigWithdrawData?.result?.meta?.totalEarnings || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Current Earnings Card */}
        <div className="p-6 rounded-2xl shadow-sm border bg-white">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Current Earnings
            </p>
            <div className="flex text-bprimary items-center gap-2">
              <SaudiRiyal size={20} />
              <h3 className="text-3xl font-bold ">
                {bookigWithdrawData?.result?.meta?.currentEarnings || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Pending Withdraw Amount Card */}
        <div className="p-6 rounded-2xl shadow-sm border bg-white">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Pending Withdraw Request
            </p>
            <div className="flex text-bprimary items-center gap-2">
              <SaudiRiyal size={20} />
              <h3 className="text-3xl font-bold ">
                {bookigWithdrawData?.result?.meta?.pendingWithdrawAmount || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="p-6 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Booking History</h3>
        </div>
        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <TableRow className="hover:bg-none">
              <TableHead className="font-semibold text-gray-700 py-4">
                Order ID
              </TableHead>
              <TableHead className="w-[150px] whitespace-nowrap font-semibold text-gray-700 py-4">
                Session Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Seeker ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Fee
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Expert Earning
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Refunded
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Penalty Deduction
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Platform Earnings
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookigWithdrawData?.result?.booking?.length > 0 ? (
              bookigWithdrawData.result.booking.map((user: any) => {
                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-800">
                      <span className="">{user?.orderId}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-block bg-gray-100 px-3 py-1 rounded-lg text-gray-700 text-sm font-medium">
                        {user.service.serviceType == "Career"
                          ? "Career Consultation"
                          : user.service.serviceType == "Cv"
                            ? "CV Optimization"
                            : user.service.serviceType == "LinkedIn"
                              ? "LinkedIn Profile Optimization"
                              : "Mock Interview"}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 text-gray-700">
                      {user?.seeker?.uniqueId}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">
                      {user.date ? (
                        <>
                          {new Date(user?.date).toLocaleString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour12: true,
                          })}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1 text-gray-800 font-semibold">
                        <SaudiRiyal size={16} className="text-bprimary" />
                        <span>{user?.price}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p
                        className={`${
                          user.status == "In_Progress"
                            ? "bg-blue-100 text-blue-700"
                            : user.status == "Resolved_In_Dispute"
                              ? "bg-orange-100 text-orange-700"
                              : user.status == "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        } px-3 py-1.5 rounded-lg inline-block font-medium text-sm`}
                      >
                        {user.status == "In_Progress"
                          ? "In Progress"
                          : user.status == "Resolved_In_Dispute"
                            ? "Resolved In Dispute"
                            : user.status}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <>
                          <SaudiRiyal size={16} className="text-bprimary" />
                          <span className="font-semibold text-gray-800">
                            {user?.earnings[0]?.amount || 0}
                          </span>
                        </>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-bprimary gap-1">
                        <SaudiRiyal size={16} />
                        <span className="font-semibold text-gray-800">
                          {user?.refundedAmount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-bprimary gap-1">
                        <SaudiRiyal size={16} />
                        <span className="font-semibold text-gray-800">
                          {user?.penaltyAmount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <>
                          <SaudiRiyal size={16} className="text-bprimary" />
                          <span className="font-semibold text-gray-800">
                            {user?.adminEarnings[0]?.amount || 0}
                          </span>
                        </>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoData
                title="Booking History"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpertBookingHistory;
