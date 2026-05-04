"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { 
  useSuspendUserMutation,
} from "@/redux/api/jobSeekerApi";
import { toast } from "sonner";

type SuspendForm = {
  days: number;
};

interface SuspendUserModalProps {
  userId: string;
  isDisabled: boolean;
}

const SuspendUserModal = ({ userId, isDisabled }: SuspendUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suspendUser] = useSuspendUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SuspendForm>();

  const watchedDays = watch("days");

  const onSubmit = async (data: SuspendForm) => {
    setIsSubmitting(true);
    const body = {
      userId,
      day: data.days,
    };
    try {
      const response = await suspendUser(body).unwrap();
      if (response?.success) {
        toast.success(response.message);
        reset();
      }
    } catch (error) {
      console.error("Failed to suspend user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          disabled={isDisabled}
          className="bg-yellow-50 text-xs cursor-pointer disabled:cursor-not-allowed text-yellow-400 px-4 py-1 rounded-[6px]"
        >
          Suspend User
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md bg-white"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            How many days do you want to suspend for?
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <input
            type="number"
            min={1}
            step={1}
            placeholder="Enter number of days"
            className="py-3 px-2 rounded-[6px] border outline-bprimary"
            {...register("days", {
              required: "Days are required",
              min: { value: 1, message: "Must be at least 1 day" },
              validate: (value) =>
                Number.isInteger(Number(value)) || "Only whole numbers allowed",
            })}
          />
          {errors.days && (
            <p className="text-red-500 text-sm">{errors.days.message}</p>
          )}

          <button
            type="submit"
            className="bg-bprimary text-white py-2 rounded-md disabled:bg-gray-400"
            disabled={isSubmitting || !watchedDays}
          >
            {isSubmitting ? "Submitting..." : "Suspend User"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendUserModal;
