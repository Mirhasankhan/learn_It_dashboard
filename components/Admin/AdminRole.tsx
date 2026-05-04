/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DataTable from "../Common/DataTable";
import Image from "next/image";
import defaultImg from "@/assets/no-img.jpg";
import {
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
} from "@/redux/api/adminApi";
import deleteIcon from "@/assets/delete.png";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import CreateAdminModal from "./AddAdminModal";
import UpdateAdminModal from "./UpdateAdminModal";

const AdminRole = () => {
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllAdminsQuery(currentPage);

  const [DeleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const handleDelete = async (id: string) => {
    try {
      const response = await DeleteAdmin(id).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.error((err as any).data.message || "Something went wrong!");
    }
  };

  const formatedData = data?.result?.admins?.map((entry: any) => ({
    Id: entry?.id,
    Name: (
      <div className="flex items-center gap-2">
        <Image
          src={entry?.profileImage || defaultImg}
          height={50}
          width={50}
          alt={entry?.name || "User"}
          className="h-10 w-10 rounded-md"
          priority
        />
        <p>{entry?.name}</p>
      </div>
    ),
    "Assign role": entry?.role,
    "Phone Number": entry?.phoneNumber,
    "Start Date": new Date(entry?.createdAt).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    Action: (
     <div className="flex">
       <UpdateAdminModal adminId={entry.id}></UpdateAdminModal>
       <button
        onClick={() => {
          setSelectedId(entry?.id);
          handleDelete(entry?.id);
        }}
        className="text-[#FF4D4F] text-[10px] font-medium rounded-sm w-fit cursor-pointer px-2 py-2"
      >
        {isDeleting && selectedId === entry?.id ? (
          <div className="flex justify-center items-center gap-2">
            <div className="animate-spin">
              <LuLoader size={18} />
            </div>
          </div>
        ) : (
          <div>
            <Image
              src={deleteIcon}
              height={24}
              width={24}
              alt="Delete"
              className="w-6 h-6"
              priority
            />
          </div>
        )}
      </button>
     
     </div>
    ),
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
        <h1 className="text-[#2D2D2D] text-2xl font-semibold">Admin & Roles</h1>
        <CreateAdminModal></CreateAdminModal>
       
      </div>

      <DataTable
        title="Admin & Role List"
        data={formatedData}
        isLoading={isLoading}
        willSearch={true}
        totalPage={data?.result?.meta?.totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AdminRole;
