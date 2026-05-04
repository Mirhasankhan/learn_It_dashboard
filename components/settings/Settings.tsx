"use client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import ManageMockSession from "./ManageMockSession";

const Settings = () => {
  const [active, setActive] = useState(true);
  return (
    <div>
      <div className="grid gap-8 grid-cols-3 items-start">
        <div className="col-span-3 lg:col-span-1 bg-white p-8 rounded-xl">
          <button
            onClick={() => setActive(true)}
            className={`${
              active == true && "bg-bprimary text-white"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px]`}
          >
            Basic <ChevronRight></ChevronRight>
          </button>
          <button
            onClick={() => setActive(false)}
            className={`${
              active == false && "bg-bprimary text-white"
            } flex justify-between text-start font-medium py-4 px-5 w-full cursor-pointer rounded-[6px]`}
          >
            Mock Interview <ChevronRight></ChevronRight>
          </button>
        </div>
        <div className="col-span-3 lg:col-span-2">
          {active == true ? (
            <UpdateProfile></UpdateProfile>
          ) : (
            <ManageMockSession></ManageMockSession>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
