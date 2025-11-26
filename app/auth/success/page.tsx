"use client";
import { EnvelopeOpen } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex text-white flex-col bg-dark h-screen p-7 w-screen overflow-hidden">
      <div className="flex items-center space-x-2">
        <Image src="/logo.svg" alt="Logo" width={30} height={30} className="" />
        <span className="text-white text-3xl font-semibold">Axle</span>
      </div>

      <div className="w-full h-full flex flex-col gap-6 justify-center items-center">
        <div className="bg-white/2 gap-6 flex flex-col w-[350px] md:w-[500px] h-[30vh] p-8 rounded-3xl">
          <EnvelopeOpen 
          size={64} 
            className="text-base mx-auto"
          />
          <p className="md:text-lg text-center text-white/90">
            Your magic link has been sent to <br />
            therealteejay25@gmail.com. Please check your mail to proceed.
          </p>
          <button className="flex w-full items-center gap-2 justify-center cursor-pointer bg-green-500 hover:bg-green-400 text-white font-semibold p-4 rounded-full">
            Continue
          </button>
        </div>

        <div className="text-white text-sm text-center">
          By continuing, you agree to our{" "}
          <Link className="font-semibold" href="/tc">
            terms of condition
          </Link>{" "}
          and{" "}
          <Link className="font-semibold" href="/privacy-policy">
            privacy policy.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
