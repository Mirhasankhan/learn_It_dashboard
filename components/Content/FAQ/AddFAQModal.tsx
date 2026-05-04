/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useCreateFAQMutation } from "@/redux/api/contentApi";
import { toast } from "sonner";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiSpinnerBold } from "react-icons/pi";

type AdminFormInputs = {
  question: string;
  answer: string;
};

const AddFAQModal = ({faqType}: {faqType:any}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, reset } = useForm<AdminFormInputs>();

  const [CreateFAQ, { isLoading: isCreating }] = useCreateFAQMutation();

  const onSubmit = async (data: AdminFormInputs) => {
    const body = {
      question: data.question,
      answer: data.answer,
      faqType
    };

    try {
      const response = await CreateFAQ(body).unwrap();
      if (response.success) {
        toast.success(response.message);
        reset() 
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  return (
    <DialogContent
      className="md:min-w-2xl max-h-[80vh] overflow-y-auto"
      showCloseButton
    >
      <DialogClose ref={closeRef} className="hidden" />
      <DialogTitle>Add {faqType} FAQ</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-[#E2E8F0] rounded-2xl p-6 mt-3 mb-6">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
                Question
              </Label>
              <Input
                type="text"
                placeholder="Type Here"
                {...register("question", { required: "Question is required!" })}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
                Answer
              </Label>
              <Input
                type="text"
                placeholder="Type Here"
                {...register("answer", { required: "Answer is required!" })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <Button
            onClick={() => closeRef.current?.click()}
            className="border border-bprimary text-bprimary bg-white hover:bg-white"
          >
            Cancel
          </Button>
          <Button className="bg-bprimary hover:bg-[#E353141A] hover:text-bprimary border border-bprimary">
            {isCreating ? (
              <div className="flex justify-center items-center gap-2">
                Submiting...
                <span className="animate-spin">
                  <PiSpinnerBold className="w-6 h-6" />
                </span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddFAQModal;
