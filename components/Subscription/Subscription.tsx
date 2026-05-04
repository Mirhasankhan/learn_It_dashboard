/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetAllPlansOfExpertQuery,
  useGetAllPlansOfUserQuery,
} from "@/redux/api/subscriptionApi";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { SyncLoader } from "react-spinners";
import { FiEdit } from "react-icons/fi";
import AddExpertPlanModal from "./AddExpertPlanModal";
import AddUserPlanModal from "./AddUserPlanModal";
import UpdateExpertPlanModal from "./UpdateExpertPlanModal";
import UpdateUserPlanModal from "./UpdateUserPlanModal";
import { SkeletonCard } from "../Common/Skeleton";

const Subscription = () => {
  const { data, isLoading } = useGetAllPlansOfUserQuery(undefined);
  const { data: expertPlans, isLoading: isExpertLoading } =
    useGetAllPlansOfExpertQuery(undefined);

  return (
    <div className="space-y-6">
      <div>
        <div className="md:flex justify-between items-center bg-white p-6 mb-10">
          <h1 className="text-[#2D2D2D] text-xl font-semibold mb-4 md:mb-0">
            Expert Subscription
          </h1>

          <Dialog>
            <DialogTrigger>
              <Button className="bg-transparent hover:bg-[#E353141A] text-bprimary border border-bprimary">
                + Add Plan
              </Button>
            </DialogTrigger>
            <AddExpertPlanModal />
          </Dialog>
        </div>

        <div>
          {isLoading ? (
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <SkeletonCard height={300} key={idx} />
                  ))}
                </div>
              ) : (
                "No Plan Found"
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertPlans?.result?.map((plan: any) => (
                <div key={plan.id} className="relative">
                  <div className="rounded-3xl border-2 border-bprimary bg-white text-xs text-[#2D2D2D] w-fit absolute -top-3 left-3 px-6 py-1">
                    {plan.title}
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-bprimary">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl text-[#2D2D2D] font-semibold mb-2">
                        ⃁ {plan?.fee}
                      </h2>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-transparent hover:bg-transparent">
                            <FiEdit size={16} color="#64748B" />
                          </Button>
                        </DialogTrigger>
                        <UpdateExpertPlanModal plan={plan} />
                      </Dialog>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature: string, index: number) => (
                        <li key={index} className="text-[#636F85] text-sm">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="md:flex justify-between items-center bg-white p-6 mb-10">
          <h1 className="text-[#2D2D2D] text-xl font-semibold mb-4 md:mb-0">
            Job Seeker Subscription
          </h1>

          <Dialog>
            <DialogTrigger>
              <Button className="bg-transparent hover:bg-[#E353141A] text-bprimary border border-bprimary">
                + Add Plan
              </Button>
            </DialogTrigger>
            <AddUserPlanModal />
          </Dialog>
        </div>

        <div>
          {isExpertLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard height={150} key={idx} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.result?.map((plan: any) => (
                <div key={plan.id} className="relative">
                  <div className="rounded-3xl border-2 border-bprimary bg-white text-xs text-[#2D2D2D] w-fit absolute -top-3 left-3 px-6 py-1">
                    {plan.title}
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-bprimary">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl text-[#2D2D2D] font-semibold mb-2">
                        ⃁ {plan?.fee}
                      </h2>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-transparent hover:bg-transparent">
                            <FiEdit size={16} color="#64748B" />
                          </Button>
                        </DialogTrigger>
                        <UpdateUserPlanModal plan={plan} />
                      </Dialog>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature: string, index: number) => (
                        <li key={index} className="text-[#636F85] text-sm">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
