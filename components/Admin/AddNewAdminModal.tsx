/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateAdminMutation } from "@/redux/api/adminApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TbPhotoPlus } from "react-icons/tb";
import { Button } from "../ui/button";
import { PiSpinnerBold } from "react-icons/pi";
import Image from "next/image";

type AdminFormInputs = {
  name: string;
  role: string;
  phoneNumber: string;
};

const AddNewAdminModal = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, setValue, reset } =
    useForm<AdminFormInputs>();

  const [CreateAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  const handleFileChange = (files: FileList | null) => {
    const selected = files && files.length > 0 ? files[0] : null;
    if (selected) {
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
    }
    setFile(selected);
  };

  const onSubmit = async (data: AdminFormInputs) => {
    const body = {
      name: data.name,
      role: data.role,
      phoneNumber: data.phoneNumber,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(body));
    if (file) {
      formData.append("profileImage", file);
    }
    try {
      const response = await CreateAdmin(formData).unwrap();
      if (response.success) {
        toast.success(response.message);
        reset();
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
      <DialogTitle>Add New Admin</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-[#E2E8F0] rounded-2xl p-6 md:flex justify-between gap-4 mt-3 mb-6">
          <div className="flex-1">
            <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
              Admin image
            </Label>
            <label>
              <div className="border border-[#D1D6DB] border-dashed rounded-[14px] cursor-pointer p-6">
                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <div className="space-y-2">
                  <TbPhotoPlus size={24} className="mx-auto" />
                  <h1 className="text-[#2D2D2D] text-sm font-medium text-center">
                    Upload new admin photo
                  </h1>
                  <p className="text-[#636F85] text-xs text-center">
                    Supports: JPG, PNG, JPEG
                  </p>
                  <div className="flex justify-center items-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-3xl shadow-none text-[#2D2D2D] text-xs"
                    >
                      Choose a file
                    </Button>
                  </div>
                </div>
              </div>
            </label>

            {preview && (
              <Image
                src={preview}
                alt="Photo"
                height={200}
                width={200}
                className="w-[200px] h-[150px] rounded-lg mx-auto mt-3"
                priority
              />
            )}
          </div>
          <div className="flex-1 space-y-4 mt-4 md:mt-0">
            <div>
              <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
                Name
              </Label>
              <Input
                type="text"
                placeholder="Type Here"
                {...register("name", { required: "Name is required!" })}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
                Assign role
              </Label>
              <Select
                onValueChange={(value) => setValue("role", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FinanceAdmin">Finance Admin</SelectItem>
                  <SelectItem value="UserAdmin">User Admin</SelectItem>
                  <SelectItem value="DisputeAdmin">Dispute Admin</SelectItem>
                  <SelectItem value="ContentAdmin">Content Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#2D2D2D] mb-3">
                Phone Number
              </Label>
              <Input
                type="tel"
                placeholder="Type Here"
                {...register("phoneNumber", {
                  required: "Phone Number is required!",
                })}
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

export default AddNewAdminModal;
