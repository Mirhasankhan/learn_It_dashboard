"use client";

import { useEffect, useState } from "react";
import {
  useMockSessionQuery,
  useUpdatemockSessionMutation,
} from "@/redux/api/sessionApi";
import { Pencil, SaudiRiyal } from "lucide-react";
import { toast } from "sonner";

type Duration =
  | "30 minutes"
  | "45 minutes"
  | "60 minutes"
  | "90 minutes"
  | "120 minutes"
  | "150 minutes"
  | "180 minutes";

const durationOptions: Duration[] = [
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes",
  "120 minutes",
  "150 minutes",
  "180 minutes",
];

const ManageMockSession = () => {
  const { data, isLoading } = useMockSessionQuery("");
  const [updateMockSession, { isLoading: isUpdating }] =
    useUpdatemockSessionMutation();

  const session = data?.result;

  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<Duration>("60 minutes");

  useEffect(() => {
    if (session) {
      setPrice(session.price);
      setDuration(session.duration);
    }
  }, [session]);

  const handleSave = async () => {
    if (price <= 0) return;

    const data = {
      duration,
      price,
    };

    await updateMockSession(data).unwrap();

    toast.success("Mock Session details updated");
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div
      className={`max-w-md rounded-2xl border p-6 transition-all ${
        isEditing ? "border-blue-300 bg-blue-50/40" : "border-gray-200 bg-white"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Mock Interview Session
      </h2>

      {/* Price */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Fee</p>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <SaudiRiyal size={18} className="text-gray-400" />
              <input
                type="number"
                value={price}
                min={0}
                step={1}
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrice(value === "" ? 0 : Math.floor(Number(value)));
                }}
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
            <SaudiRiyal size={20} />
            {session.price}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Duration</p>

        {isEditing ? (
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as Duration)}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {durationOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-base font-medium text-gray-800">
            {session.duration}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <button
              onClick={() => {
                setPrice(session.price);
                setDuration(session.duration);
                setIsEditing(false);
              }}
              className="rounded-lg cursor-pointer border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 cursor-pointer px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "Saving.." : " Save Changes"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg cursor-pointer xt-sm font-medium text-bprimary"
          >
            <Pencil size={30}></Pencil>
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageMockSession;
