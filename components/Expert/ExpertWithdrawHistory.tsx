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

const ExpertWithdrawHistory = ({ id }: { id: string }) => {
  const {
    data: bookigWithdrawData,
    isLoading,
    isFetching,
  } = useGetExpertBookingWithdrawQuery(id);

  return (
    <div className="p-6 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Withdrawal History</h3>
      </div>
      <Table className="rounded-lg min-w-[1000px]">
        <TableHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <TableRow className="hover:bg-none">
            <TableHead className="font-semibold text-gray-700 py-4">
              Withdrawal ID
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Payout Account Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Mobile
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              City
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Requested At
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookigWithdrawData?.result?.withdraw?.length > 0 ? (
            bookigWithdrawData.result.withdraw.map((withdraw: any) => {
              return (
                <TableRow
                  key={withdraw.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-800">
                    {withdraw?.withdrawId}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1 text-gray-800 font-semibold">
                      <SaudiRiyal size={16} className="text-bprimary" />
                      <span>{withdraw?.amount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <p
                        className={`${
                          withdraw.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : withdraw.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        } px-3 py-1.5 rounded-lg font-medium text-sm`}
                      >
                        {withdraw.status}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-700 font-medium">
                    {withdraw?.payoutAccount?.name}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {withdraw?.payoutAccount?.mobile}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {withdraw?.payoutAccount?.city}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600 text-sm">
                    {new Date(withdraw?.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="Withdrawal History"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpertWithdrawHistory;
