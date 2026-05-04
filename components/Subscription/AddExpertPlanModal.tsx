/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreatePlanForExpertMutation } from "@/redux/api/subscriptionApi";
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

export const planSchema = z.object({
  title: z.string().min(3, "Plan name is required"),
  fee: z.number().min(1, "Price must be greater than 0"),
  mockCut: z.number().min(1, "Mock Cut must be greater than 0"),
  serviceCut: z.number().min(1, "Service Cut must be greater than 0"),
  type: z.enum(["Monthly", "Yearly"]),
  features: z
    .array(
      z.object({
        value: z.string().min(1, "Feature cannot be empty"),
      })
    )
    .min(1, "At least one feature is required"),
});

const AddExpertPlanModal = () => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      fee: 0,
      mockCut: 0,
      serviceCut: 0,
      type: "Monthly",
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const [createPlan, { isLoading }] = useCreatePlanForExpertMutation();

  const onSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      fee: Number(data.fee),
      mockCut: Number(data.mockCut),
      serviceCut: Number(data.serviceCut),
      type: data.type,
      features: data.features.map((f: any) => f.value),
    };

    try {
      const response = await createPlan(payload).unwrap();
      if (response.success) {
        toast.success(response.message || "Plan created successfully");
        reset();
      }
    } catch (error) {
      toast.error(
        (error as any).data.message ||
          "Failed to create plan. Please try again."
      );
    }
  };

  return (
    <DialogContent
      className="max-w-sm md:max-w-xl max-h-[80vh] overflow-y-auto"
      showCloseButton
    >
      <DialogClose ref={closeRef} className="hidden" />

      <h2 className="text-2xl text-[#2D2D2D] font-semibold mb-4">Add Plan</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:border border-[#64748B] rounded-2xl md:p-6">
          <div className="md:flex justify-between items-center gap-6">
            <div className="flex-1 space-y-2">
              <Label>Plan Name</Label>
              <Input {...register("title")} placeholder="Type Here" />
              <p className="text-red-500 text-xs">{errors.title?.message}</p>
            </div>

            <div className="flex-1 space-y-2">
              <Label>Plan Price</Label>
              <Input
                type="number"
                {...register("fee", { valueAsNumber: true })}
                placeholder="Type Here"
              />
              <p className="text-red-500 text-xs">{errors.fee?.message}</p>
            </div>
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
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <p className="text-red-500 text-xs">{errors.type?.message}</p>
          </div>

          <div className="md:flex justify-between items-center gap-6">
            <div className="flex-1 space-y-2">
              <Label>Mock Cut</Label>
              <Input
                type="number"
                {...register("mockCut", { valueAsNumber: true })}
                placeholder="Type Here"
              />
              <p className="text-red-500 text-xs">{errors.mockCut?.message}</p>
            </div>

            <div className="flex-1 space-y-2">
              <Label>Service Cut</Label>
              <Input
                type="number"
                {...register("serviceCut", { valueAsNumber: true })}
                placeholder="Type Here"
              />
              <p className="text-red-500 text-xs">
                {errors.serviceCut?.message}
              </p>
            </div>
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
          </div>

          <p className="text-red-500 text-xs">{errors.features?.message}</p>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => append({ value: "" })}
              className="text-black text-sm bg-transparent hover:bg-transparent border border-bprimary rounded-3xl w-fit ml-auto mt-4"
            >
              + Add More Feature
            </Button>
          </div>
        </div>

        <div className="flex justify-start gap-3 pt-2">
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
              <div className="flex justify-center items-center gap-2">
                Submitting...{" "}
                <div className="animate-spin">
                  <LuLoader size={18} />
                </div>
              </div>
            ) : (
              <div>Submit</div>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddExpertPlanModal;
