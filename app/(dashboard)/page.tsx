"use client";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { JWTDecodeToken } from "@/lib/jwtDecode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { decoded }: any = JWTDecodeToken();
  const router = useRouter();
  useEffect(() => {
    if (!decoded?.role || decoded?.role !== "SuperAdmin") {
      router.replace("/login");
    }
  }, [decoded, router]);
  return (
    <div>
      <DashboardLayout />
    </div>
  );
}
