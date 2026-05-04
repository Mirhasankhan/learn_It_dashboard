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
  useGetAllWithdrawRequestsQuery,
  useRejectUserMutation,
} from "@/redux/api/withdrawApi";
import { Ellipsis, RotateCw, SaudiRiyal } from "lucide-react";
import { useAcceptUserMutation } from "@/redux/api/expertApi";
import { toast } from "sonner";
import WithdrawDetailsModal from "../modal/WithdrawDetailsModal";

const AllWithdraws = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  // 🔹 row-level action state
  const [activeAction, setActiveAction] = useState<{
    id: string | null;
    type: "accept" | "reject" | null;
  }>({ id: null, type: null });

  const [AcceptUser] = useAcceptUserMutation();
  const [RejectUser] = useRejectUserMutation();

  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllWithdrawRequestsQuery({ page, status });

  const totalPage = users?.result?.meta?.totalPages;

  const handleAccept = async (id: string) => {
    setActiveAction({ id, type: "accept" });
    try {
      const response = await AcceptUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
      setActiveAction({ id: null, type: null });
    }
  };

  const handleReject = async (id: string) => {
    setActiveAction({ id, type: "reject" });
    try {
      const response = await RejectUser(id).unwrap();
      if (response?.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    } finally {
      setActiveAction({ id: null, type: null });
    }
  };

  return (
    <div className="p-5 mb-6 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 items-center gap-6">
        <div className="flex-1 bg-white border rounded-xl p-5">
          <h1 className="text-[#636F85] font-medium">
            Total Transferred Money
          </h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="text-[#2D2D2D]  flex gap-1 items-center font-semibold text-[32px] mt-1">
              <SaudiRiyal size={35}></SaudiRiyal>{" "}
              {users?.result?.meta?.totalTransferred}
            </p>
          )}
        </div>

        <div className="flex-1 bg-white border rounded-xl p-5 mt-6 md:mt-0">
          <h1 className="text-[#636F85] font-medium">Payout Requests</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="text-[#2D2D2D] font-semibold text-[32px] mt-1">
              {users?.result?.meta?.totalRequests}
            </p>
          )}
        </div>
        <div className="flex-1 bg-white border rounded-xl p-5 mt-6 md:mt-0">
          <h1 className="text-[#636F85] font-medium">Pending Request Amount</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="text-[#2D2D2D]  flex gap-1 items-center font-semibold text-[32px] mt-1">
              <SaudiRiyal size={35}></SaudiRiyal>{" "}
              {users?.result?.meta?.pendingRequestMoney}
            </p>
          )}
        </div>
        <div className="flex-1 bg-white border rounded-xl p-5 mt-6 md:mt-0">
          <h1 className="text-[#636F85] font-medium">Not Requested Yet</h1>
          {isLoading ? (
            <Ellipsis size={40} className="animate-ping"></Ellipsis>
          ) : (
            <p className="text-[#2D2D2D]  flex gap-1 items-center font-semibold text-[32px] mt-1">
              <SaudiRiyal size={35}></SaudiRiyal>{" "}
              {users?.result?.meta?.currentEarnings}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white mt-8 rounded-[6px] p-6">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="md:font-medium">Withdraw List</h1>
          <div className="flex gap-1 ">
            <select
              className="border rounded-md px-2 py-1"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
            </select>
            <button
              onClick={() => window.location.reload()}
              className="border hidden md:flex items-center gap-1 px-4 text-gray-600 rounded-[6px] cursor-pointer py-1"
            >
              Refresh <RotateCw size={15}></RotateCw>
            </button>
            {/* <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-2 rounded-lg py-1"
              placeholder="search"
              type="text"
            /> */}
          </div>
        </div>

        <Table className="rounded-lg min-w-[900px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Withdraw ID</TableHead>
              <TableHead>Expert</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.result?.withdraws?.length > 0 ? (
              users.result.withdraws.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell> {user.withdrawId}</TableCell>
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
                    <div className="flex items-center">
                      <SaudiRiyal size={15} /> {user?.amount} /=
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
                    <p
                      className={`${
                        user.status === "Pending"
                          ? "bg-yellow-50 text-yellow-300"
                          : user.status === "In_Progress"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-green-50 text-green-500"
                      } py-1 px-3 rounded-[6px] inline-block`}
                    >
                      {user.status == "In_Progress"
                        ? "Verifying By Moyasar"
                        : user.status}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3">
                      <button
                        disabled={
                          user.status !== "Pending" ||
                          activeAction.id === user.id
                        }
                        onClick={() => handleAccept(user.id)}
                        className="bg-green-50 disabled:cursor-not-allowed text-green-400 px-3 py-1 rounded-[6px]"
                      >
                        {activeAction.id === user.id &&
                        activeAction.type === "accept"
                          ? "Accepting.."
                          : "Accept"}
                      </button>

                      <button
                        disabled={
                          user.status !== "Pending" ||
                          activeAction.id === user.id
                        }
                        onClick={() => handleReject(user.id)}
                        className="bg-red-50 disabled:cursor-not-allowed text-red-400 px-3 py-1 rounded-[6px]"
                      >
                        {activeAction.id === user.id &&
                        activeAction.type === "reject"
                          ? "Rejecting.."
                          : "Reject"}
                      </button>
                      <WithdrawDetailsModal id={user.id}></WithdrawDetailsModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoData
                title="Withdraw"
                isLoading={isLoading}
                isFetching={isFetching}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {users?.result?.withdraws?.length > 0 && (
        <Pagination totalPage={totalPage} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default AllWithdraws;
