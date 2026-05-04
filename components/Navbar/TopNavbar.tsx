/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import user from "@/assets/no-img.jpg";
import Link from "next/link";
import Image from "next/image";
import download from "@/assets/download.svg";
import { FaRegFileAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAdminProfileQuery } from "@/redux/api/adminApi";
import { JWTDecodeToken } from "@/lib/jwtDecode";

const TopNavbar = () => {
  const { data: profile } = useAdminProfileQuery("");
  const { decoded }: any = JWTDecodeToken();

  const pathname = usePathname();
  const isActive = pathname === "/notification";
  const isActivity = pathname === "/activity";
  return (
    <>
      <div className="bg-white flex justify-between items-center gap-2 h-[90px] fixed z-20 top-0 left-20 lg:left-[250px] xl:left-[286px] right-0 w-[calc(100%-80px)] lg:w-[calc(100%-250px)] xl:w-[calc(100%-286px)] px-4 md:px-6 lg:shadow-xs">
        <h1 className="md:text-2xl text-[#2D2D2D] font-bold">Overview</h1>

        <div className="flex justify-end items-center gap-3 lg:gap-4">
          <div className="bg-bprimary shadow-[0_0_10px_0_rgba(227, 83, 20, 0.10)] rounded-full p-1.5">
            <Image
              src={download}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-6 h-6"
              priority
            />
          </div>
          {decoded?.role == "SuperAdmin" && (
            <Link
              href="/activity"
              className={`rounded-full  ${
                isActivity ? "bg-bprimary text-white" : "bg-white text-gray-600"
              }  shadow-[0_0_10px_rgba(227,83,20,0.10)] p-1.5`}
            >
              <FaRegFileAlt size={22} />
            </Link>
          )}
          {(decoded?.role === "SuperAdmin" ||
            decoded?.role === "ContentAdmin") && (
            <Link
              href="/notification"
              className={`rounded-full ${
                isActive ? "bg-bprimary text-white" : "bg-white"
              } shadow-[0_0_10px_rgba(227,83,20,0.10)] p-1.5 relative`}
            >
              <Bell />
              <p className="border-2 border-white bg-bprimary rounded-full absolute right-2 top-2 p-0.5"></p>
            </Link>
          )}
          <Link
            href="/settings"
            className="flex justify-center items-center gap-3 text-[#636F85] font-medium bg-[#F5F5F5] rounded-3xl h-full cursor-pointer"
          >
            <Image
              src={profile?.result?.profileImage || user}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-10 h-10"
              priority
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
