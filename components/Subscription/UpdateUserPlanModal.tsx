/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdatePlanForUserMutation } from "@/redux/api/subscriptionApi";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DialogClose, DialogContent } from "../ui/dialog";
import { LuLoader } from "react-icons/lu";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";

export const userPlanSchema = z.object({
  title: z.string().min(3, "Plan name is required"),
  fee: z.number().min(1, "Price must be greater than 0"),
  freeSession: z.number().min(0),
  type: z.enum(["ThreeDays", "Weekly", "Monthly", "Yearly"]),
  features: z
    .array(
      z.object({
        value: z.string().min(1, "Feature cannot be empty"),
      })
    )
    .min(1),
});

const UpdateUserPlanModal = ({
  plan,
}: {
  plan?: {
    id: string;
    title: string;
    fee: number;
    freeSession: number;
    type: "ThreeDays" | "Weekly" | "Monthly" | "Yearly";
    features: string[];
  };
}) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof userPlanSchema>>({
    resolver: zodResolver(userPlanSchema),
    defaultValues: plan
      ? {
          title: plan.title,
          fee: plan.fee,
          freeSession: plan.freeSession,
          type: plan.type,
          features: plan.features.map((f) => ({ value: f })),
        }
      : {
          title: "",
          fee: 0,
          freeSession: 0,
          type: "ThreeDays",
          features: [{ value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const [updatePlan, { isLoading }] = useUpdatePlanForUserMutation();

  const onSubmit = async (data: z.infer<typeof userPlanSchema>) => {
    const payload = {
      planId: plan?.id,
      title: data.title,
      fee: data.fee,
      freeSession: data.freeSession,
      type: data.type,
      features: data.features.map((f) => f.value),
    };

    try {
      const response = await updatePlan(payload).unwrap();
      if (response.success) {
        toast.success(response.message || "Plan updated successfully");
        reset(data); // reset to updated values
        closeRef.current?.click();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update plan. Please try again."
      );
    }
  };

  return (
    <DialogContent
      className="max-w-sm md:max-w-xl max-h-[80vh] overflow-y-auto"
      showCloseButton
    >
      <DialogClose ref={closeRef} className="hidden" />
      <h2 className="text-2xl font-semibold mb-4">
        {plan ? "Update User Plan" : "Add User Plan"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:border rounded-2xl md:p-6 space-y-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input {...register("title")} placeholder="Type Here" />
            <p className="text-red-500 text-xs">{errors.title?.message}</p>
          </div>

          {/* Plan Price */}
          <div className="space-y-2">
            <Label>Plan Price</Label>
            <Input
              type="number"
              {...register("fee", { valueAsNumber: true })}
              placeholder="Type Here"
            />
            <p className="text-red-500 text-xs">{errors.fee?.message}</p>
          </div>

          {/* Free Sessions */}
          <div className="space-y-2">
            <Label>Free Sessions</Label>
            <Input
              type="number"
              {...register("freeSession", { valueAsNumber: true })}
              placeholder="Type Here"
            />
            <p className="text-red-500 text-xs">
              {errors.freeSession?.message}
            </p>
          </div>

          {/* Plan Type */}
          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ThreeDays">Three Days</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-red-500 text-xs">{errors.type?.message}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`features.${index}.value`)}
                  placeholder={`Feature ${index + 1}`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <p className="text-red-500 text-xs">{errors.features?.message}</p>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => append({ value: "" })}
                className="text-black text-sm bg-transparent hover:bg-transparent border border-bprimary rounded-3xl w-fit ml-auto mt-2"
              >
                + Add More Feature
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={() => closeRef.current?.click()}
            className="px-4 py-2 bg-transparent hover:bg-transparent border border-bprimary text-bprimary rounded-lg"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary text-white px-4 py-2 rounded-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                Submitting <LuLoader className="animate-spin" size={16} />
              </div>
            ) : plan ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default UpdateUserPlanModal;
