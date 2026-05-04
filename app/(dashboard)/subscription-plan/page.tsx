"use client";
import AllSubscribedUsers from "@/components/Subscription/AllSubscribedUsers";
import Subscription from "@/components/Subscription/Subscription";
import { useState } from "react";

const Page = () => {
  const [active, setActive] = useState(true);
  return (
    <div>
      <div className="flex pb-5 justify-between">
        <h1 className="md:text-xl font-medium">Subscription Management</h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-white cursor-pointer px-4 py-2 rounded-[6px]"
        >
          {active ? "View Susbcribers" : "View Plans"}
        </button>
      </div>
      {active == true ? <Subscription></Subscription> :<AllSubscribedUsers></AllSubscribedUsers>}
    </div>
  );
};

export default Page;
