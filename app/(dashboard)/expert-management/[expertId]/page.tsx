"use client";

import ExpertBookingHistory from "@/components/Expert/ExpertBookingHistory";
import ExpertWithdrawHistory from "@/components/Expert/ExpertWithdrawHistory";
import { useGetExpertBookingWithdrawQuery } from "@/redux/api/expertApi";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const EarningHistory = () => {
  const params = useParams<{ expertId: string }>();

  useEffect(() => {
    if (params?.expertId) {
      console.log("expertId:", params.expertId);
    }
  }, [params]);

  return (
    <div>
      <ExpertBookingHistory id={params?.expertId}></ExpertBookingHistory>
      <ExpertWithdrawHistory id={params?.expertId}></ExpertWithdrawHistory>
    </div>
  );
};

export default EarningHistory;
