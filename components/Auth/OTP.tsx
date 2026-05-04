/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import logo from "@/assets/logo.png";
import preview from "@/assets/login.svg";
import { Controller, useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminLoginMutation,
  useVerifyOTPMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const RESEND_DURATION = 43;

const OTP = () => {
  const router = useRouter();

  const [VerifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [Login, { isLoading: isResendLoading }] = useAdminLoginMutation();

  const [timeLeft, setTimeLeft] = useState(RESEND_DURATION);
  const [isCounting, setIsCounting] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "2155", // ✅ preserved
    },
  });

  const number = Cookies.get("number");

  // ⏳ Countdown – UI only
  useEffect(() => {
    if (!isCounting) return;

    if (timeLeft === 0) {
      setIsCounting(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCounting]);

  // ✅ OTP submit (unchanged logic)
  const onSubmit = async () => {
    const body = {
      phoneNumber: number,
      otp: "2155",
    };

    try {
      const response = await VerifyOTP(body).unwrap();

      toast.success(response.message);

      Cookies.set("token", response.result.accessToken);
      Cookies.remove("number");

      if (response.result.role === "SuperAdmin") router.push("/");
      else if (response.result.role === "FinanceAdmin")
        router.push("/withdrawals");
      else if (response.result.role === "UserAdmin")
        router.push("/job-seeker-management");
      else if (response.result.role === "ContentAdmin")
        router.push("/terms-and-conditions");
      else if (response.result.role === "DisputeAdmin")
        router.push("/reviews-feedback");
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  // 🔁 Resend (manual only)
  const handleResend = async () => {
    if (isCounting) return;

    try {
      const body = {
        phoneNumber: number,
      };
      const res = await Login(body).unwrap();
      console.log(res);
      toast.success("Verification code resent successfully");

      setTimeLeft(RESEND_DURATION);
      setIsCounting(true);
    } catch (error) {
      toast.error((error as any)?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={preview}
          alt="Login Image"
          height={800}
          width={600}
          className="max-h-[750px] max-w-[550px] m-auto"
          priority
        />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white border-l border-[#D1D6DB]">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          <div className="mb-12 pl-6">
            <Image
              src={logo}
              height={200}
              width={200}
              alt="Logo"
              className="w-[120px] md:w-[150px] h-[120px] md:h-[150px] rounded-lg"
              priority
            />
          </div>

          <div className="p-8">
            <h2 className="text-[32px] font-semibold text-[#2D2D2D]">
              Verification Code
            </h2>
            <p className="mt-2.5 text-[#636F85]">
              Enter the verification code that we have sent to your phone number
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center mt-6 mb-2">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP {...field} maxLength={4}>
                      <InputOTPGroup className="flex gap-6">
                        {[0, 1, 2, 3].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-[50px] md:h-[55px] w-[50px] md:w-[55px] border border-bprimary rounded-xl bg-white text-xl font-semibold text-[#2D2D2D]"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>

              {errors.otp && (
                <p className="text-center text-sm text-red-500 mb-6">
                  {errors.otp.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bprimary mt-6 text-white font-semibold rounded-3xl px-6 py-4"
              >
                {isLoading ? (
                  <Loader className="mx-auto animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                disabled={isCounting || isResendLoading}
                className={`block mx-auto text-sm mt-6 ${
                  isCounting || isResendLoading
                    ? "text-[#2D2D2D] cursor-not-allowed"
                    : "text-bprimary font-medium cursor-pointer"
                }`}
              >
                {isResendLoading ? (
                  "Resending..."
                ) : isCounting ? (
                  <>
                    Re-send OTP in{" "}
                    <span className="font-medium text-bprimary">
                      0:{timeLeft.toString().padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  "Re-send OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
