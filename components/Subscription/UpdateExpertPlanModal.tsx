/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialog";
import { LuLoader } from "react-icons/lu";
import { toast } from "sonner";
import { useUpdatePlanForExpertMutation } from "@/redux/api/subscriptionApi";

export const updateExpertPlanSchema = z.object({
  id: z.string().min(1, "Plan id is required"),
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
    .min(1),
});

type Props = {
  plan: {
    id: string;
    title: string;
    fee: number;
    mockCut: number;
    serviceCut: number;
    type: "Monthly" | "Yearly";
    features: string[];
  };
};

const UpdateExpertPlanModal = ({ plan }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateExpertPlanSchema>>({
    resolver: zodResolver(updateExpertPlanSchema),
    defaultValues: {
      id: plan.id,
      title: plan.title,
      fee: plan.fee,
      mockCut: plan.mockCut,
      serviceCut: plan.serviceCut,
      type: plan.type,
      features: plan?.features?.map((f) => ({ value: f })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const [updatePlan, { isLoading }] = useUpdatePlanForExpertMutation();

  const onSubmit = async (data: z.infer<typeof updateExpertPlanSchema>) => {
    const payload = {
      planId: data.id, // ✅ REQUIRED
      title: data.title,
      fee: data.fee,
      mockCut: data.mockCut,
      serviceCut: data.serviceCut,
      type: data.type,
      features: data.features.map((f: any) => f.value),
    };

    try {
      const res = await updatePlan(payload).unwrap();
      if (res.success) {
        toast.success("Expert plan updated successfully");
        reset(payload);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update plan");
    }
  };

  return (
    <DialogContent
      className="max-w-xl max-h-[80vh] overflow-y-auto"
      showCloseButton
    >
      <h2 className="text-2xl font-semibold mb-4">Update Expert Plan</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="border rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input {...register("title")} />
            <p className="text-xs text-red-500">{errors.title?.message}</p>
          </div>

          <div className="space-y-2">
            <Label>Plan Price</Label>
            <Input
              type="number"
              {...register("fee", { valueAsNumber: true })}
            />
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Mock Cut</Label>
              <Input
                type="number"
                {...register("mockCut", { valueAsNumber: true })}
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label>Service Cut</Label>
              <Input
                type="number"
                {...register("serviceCut", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mt-2">
                <Input {...register(`features.${index}.value`)} />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary text-white px-4 py-2 rounded-lg"
        >
          {isLoading ? <LuLoader className="animate-spin" /> : "Update"}
        </Button>
      </form>
    </DialogContent>
  );
};

export default UpdateExpertPlanModal;
