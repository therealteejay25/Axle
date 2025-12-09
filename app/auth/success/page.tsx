"use client";
import {
  ArrowRightIcon,
  EnvelopeOpenIcon,
  CheckCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const page = () => {
  return (
    <div className="flex text-white flex-col bg-dark h-screen p-4 w-screen overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 mb-8"
      >
        <Image src="/logo.svg" alt="Logo" width={30} height={30} className="" />
        <span className="text-white text-2xl font-bold">xle</span>
      </motion.div>

      <div className="w-full h-full flex flex-col gap-6 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white/2 gap-6 flex flex-col w-[350px] md:w-[500px] p-8 rounded-3xl border border-white/10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto"
          >
            <EnvelopeOpenIcon size={64} className="text-base" />
          </motion.div>
          <p className="text-center text-white/90 text-lg">
            Your magic link has been sent! Please check your email to continue.
          </p>
          <motion.a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center gap-2 justify-center cursor-pointer bg-base hover:bg-base/90 text-white font-semibold p-4 rounded-full transition-all"
          >
            Open Email
            <ArrowRightIcon size={20} className="text-white" />
          </motion.a>
        </motion.div>

        <div className="text-white/60 text-sm text-center">
          By continuing, you agree to our{" "}
          <Link className="font-semibold text-base hover:underline" href="/tc">
            terms of condition
          </Link>{" "}
          and{" "}
          <Link
            className="font-semibold text-base hover:underline"
            href="/privacy-policy"
          >
            privacy policy.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
