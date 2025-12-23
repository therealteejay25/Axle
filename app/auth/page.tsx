"use client";
import React, { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  async function requestMagic(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) setStatus("Magic link sent if the email exists.");
      else setStatus("Failed to send magic link.");
    } catch (err) {
      setStatus("Error sending request");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Sign in or Create account
        </h2>
        <form onSubmit={requestMagic} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-violet-600 text-white rounded">
              Send magic link
            </button>
          </div>
        </form>
        {status && <div className="mt-3 text-sm text-slate-500">{status}</div>}
      </div>
    </div>
  );
}
"use client";
import { EnvelopeIcon, UserIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AuthRequestType } from "@/types/AuthRequest";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";

const Authpage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !email.includes("@")) {
        showToast("Please enter a valid email address", "error");
        return;
      }
      if (!name || name.trim().length < 2) {
        showToast("Please enter your name", "error");
        return;
      }

      await authAPI.requestMagicLink(name, email);
      showToast("Magic link sent! Check your email.", "success");
      router.push("/auth/success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send magic link";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-dark min-h-screen p-4 w-screen overflow-hidden">
      <div className="mb-8 sm:mb-12">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="h-auto w-8 sm:w-10"
        />
      </div>
      <div className="w-full flex-1 flex gap-6 flex-col justify-center items-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white text-center">
          Enter your email to continue to axle.
        </h1>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="bg-white/2 gap-4 flex flex-col w-full sm:w-[85%] md:w-[70%] lg:w-[30%] h-auto p-6 sm:p-8 lg:p-10 rounded-4xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex w-full items-center gap-3 bg-white/2 py-4 sm:py-5 px-4 rounded-2xl focus-within:border-base transition-all duration-200">
            <UserIcon className="text-white/50 h-5 w-5 shrink-0" />
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter your name here..."
              className="placeholder:text-white/50 w-full outline-0 text-white bg-transparent text-sm"
            />
          </div>
          <div className="flex w-full items-center gap-3 bg-white/2 p-4 sm:p-5 rounded-2xl focus-within:border-base transition-all duration-200">
            <EnvelopeIcon className="text-white/50 h-5 w-5 shrink-0" />
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email address here..."
              className="placeholder:text-white/50 w-full outline-0 text-white bg-transparent text-sm"
            />
          </div>
          <button className="flex w-full items-center gap-2 justify-center cursor-pointer bg-base hover:bg-base/90 active:scale-95 text-white font-semibold p-3 sm:p-3.5 rounded-full transition-all duration-200 mt-2  sm:text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Continuing..." : "Continue"}
          </button>
        </form>
        <div className="text-white/60 text-xs sm:text-sm text-center px-4">
          By continuing, you agree to our{" "}
          <Link
            className="font-semibold text-white hover:text-base transition-colors"
            href="/tc"
          >
            terms of condition
          </Link>{" "}
          and{" "}
          <Link
            className="font-semibold text-white hover:text-base transition-colors"
            href="/privacy-policy"
          >
            privacy policy.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Authpage;
