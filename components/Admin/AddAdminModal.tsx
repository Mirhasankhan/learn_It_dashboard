"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PhoneNumberInput from "../Auth/PhoneInput";
import { useCreateAdminMutation } from "@/redux/api/adminApi";
import { Plus } from "lucide-react";

const ROLES = [
  { label: "User Admin", value: "UserAdmin" },
  { label: "Finance Admin", value: "FinanceAdmin" },
  { label: "Dispute Admin", value: "DisputeAdmin" },
  { label: "Content Admin", value: "ContentAdmin" },
];

type Errors = {
  adminName?: string;
  role?: string;
  phone?: string;
  profileImage?: string;
};

const CreateAdminModal = () => {
  const [open, setOpen] = useState(false);
  const [createAdmin] = useCreateAdminMutation();
  const [adminName, setAdminName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("966");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({}); 
 
  const validate = () => {
    const newErrors: Errors = {};
    if (!adminName.trim()) newErrors.adminName = "Admin name is required";
    if (!role) newErrors.role = "Please select a role";
    if (!phone || phone.length < 5)
      newErrors.phone = "Valid phone number is required";
    if (!profileImage) newErrors.profileImage = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    const payload = { name: adminName, phoneNumber: phone, role };

    formData.append("profileImage", profileImage!);
    formData.append("bodyData", JSON.stringify(payload));

    try {
      setLoading(true);
      await createAdmin(formData);
      setOpen(false);

      // reset
      setAdminName("");
      setRole("");
      setPhone("966");
      setProfileImage(null);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = profileImage ? URL.createObjectURL(profileImage) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-bprimary flex items-center gap-1 cursor-pointer text-white px-4 py-2 rounded-[6px]">
          <Plus className="font-medium" size={18} /> Add New Admin
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Admin Name */}
          <div>
            <label className="text-sm font-medium">Admin Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => {
                setAdminName(e.target.value);
                setErrors((p) => ({ ...p, adminName: undefined }));
              }}
              className={`w-full mt-1 h-12 border rounded-md px-3 ${
                errors.adminName ? "border-red-500" : ""
              }`}
              placeholder="Enter admin name"
            />
            {errors.adminName && (
              <p className="text-sm text-red-500 mt-1">{errors.adminName}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setErrors((p) => ({ ...p, role: undefined }));
              }}
              className={`w-full mt-1 h-12 border rounded-md px-3 ${
                errors.role ? "border-red-500" : ""
              }`}
            >
              <option value="">Select role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <PhoneNumberInput
              phone={phone}
              setPhone={(val) => {
                setPhone(val);
                setErrors((p) => ({ ...p, phone: undefined }));
              }}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-sm font-medium">Profile Image</label>
            <div
              className={`mt-2 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-bprimary transition ${
                errors.profileImage ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => document.getElementById("profileUpload")?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <>
                  <p className="font-medium">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </>
              )}
            </div>

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setProfileImage(e.target.files?.[0] || null);
                setErrors((p) => ({ ...p, profileImage: undefined }));
              }}
            />

            {errors.profileImage && (
              <p className="text-sm text-red-500 mt-1">
                {errors.profileImage}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-bprimary text-white rounded-md disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;
