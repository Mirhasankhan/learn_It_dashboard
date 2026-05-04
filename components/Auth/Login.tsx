/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import preview from "@/assets/login.svg";
import logo from "@/assets/logo.png";
import { useAdminLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PhoneNumberInput from "./PhoneInput";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";

export default function Login() {
  const route = useRouter();
  const [phone, setPhone] = useState("");
  const [Login, { isLoading }] = useAdminLoginMutation();

  const handleLogin = async () => {
    const body = {
      phoneNumber: phone,
    };

    try {
      const response = await Login(body).unwrap();
      if (response.success) {
        toast.success(response.message);
        route.push("/otp");
        Cookies.set("number", phone);
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Ocean Background */}
      <div className="hidden lg:flex  lg:w-1/2 relative">
        <Image
          src={preview}
          alt="Login Image"
          height={800}
          width={600}
          className="max-h-[750px] max-w-[550px] m-auto"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white border-l border-[#D1D6DB]">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          {/* Logo and Brand */}
          <div className="mb-8 md:mb-14 pl-6 md:pl-0">
            <Image
              src={logo}
              height={200}
              width={200}
              alt="Logo"
              className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px] rounded-lg"
              priority
            />
          </div>

          <div className="grow"></div>

          {/* Login Form */}
          <div className="p-8">
            <div className="text-start">
              <h2 className="text-[32px] font-semibold text-[#2D2D2D]">
                Login
              </h2>
              <p className="my-2.5 text-[#636F85]">
                Let’s login into your account first
              </p>
            </div>

            <div className="w-full">
              <PhoneNumberInput
                setPhone={setPhone}
                phone={phone}
              ></PhoneNumberInput>
            </div>
            <button
              onClick={() => handleLogin()}
              disabled={isLoading || !phone || phone == "966"}
              className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary  text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
            >
              {isLoading ? (
                <Loader className="mx-auto animate-spin"></Loader>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="grow"></div>

          <div className="text-center text-sm cursor-pointer mt-20">
            <span className="text-[#2D2D2D]">
              © {new Date().getFullYear()} SEFR. All rights reserved.
            </span>
            {/* <span className="text-bprimary hover:underline font-semibold ml-3">
              Term & Condition
            </span>
            <span className="text-bprimary hover:underline font-semibold border-l border-[#D1D6DB] pl-4 ml-4">
              Privacy & Policy
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
