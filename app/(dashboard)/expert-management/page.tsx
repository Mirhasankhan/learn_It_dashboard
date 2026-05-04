"use client";
import AllExperts from "@/components/Expert/AllExperts";
import ExpertApplications from "@/components/Expert/ExpertApplication";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (view === "applications") {
      setActive(false);
    }
  }, [view]);
  return (
    <div>
      <div className="flex items-center pb-5 justify-between">
        <h1 className="md:text-xl font-medium">
          {active ? "Expert Management" : "Expert Applications"}
        </h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer text-xs md:text-[16px] px-2 md:px-4 py-2 rounded-[6px]"
        >
          {active ? "Expert Applications" : "View Expert List"}
        </button>
      </div>
      {active == true ? (
        <AllExperts></AllExperts>
      ) : (
        <ExpertApplications></ExpertApplications>
      )}
    </div>
  );
};

export default Page;
