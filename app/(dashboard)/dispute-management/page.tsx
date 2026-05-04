"use client";
import AllExpertReports from "@/components/Dispute/AllExpertReports";
import AllReports from "@/components/Dispute/AllReports";
import { useState } from "react";

const Page = () => {
  const [active, setActive] = useState(true);
  return (
    <div>
      <div className="flex pb-5 items-center justify-between">
        <h1 className="text-xs md:text-xl font-medium">Dispute Management</h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer text-xs md:text-[16px] px-4 py-2 rounded-[6px]"
        >
          {active ? "View Expert Reports" : "View User Reports"}
        </button>
      </div>
      {active == true ? (
        <AllReports></AllReports>
      ) : (
        <AllExpertReports/>
      )}
    </div>
  );
};

export default Page;
