"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const [status, setStatus] = useState("Verifying...");
  const params = useSearchParams();
  const token = params.get("token") || "";

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch("/api/v1/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          setStatus("Signed in — you may close this window.");
        } else {
          setStatus("Verification failed.");
        }
      } catch (err) {
        setStatus("Error verifying token.");
      }
    }
    if (token) verify();
    else setStatus("No token provided.");
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-4">Verifying...</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, CircleNotch } from "@phosphor-icons/react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import Link from "next/link";

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your magic link...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verify = async () => {
      try {
        const data = await authAPI.verifyMagicLink(token);
        setStatus("success");
        setMessage("Successfully authenticated! Redirecting...");
        showToast("Welcome to Axle!", "success");
        setTimeout(() => {
          router.push("/app");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Verification failed");
        showToast(error.message || "Verification failed", "error");
      }
    };

    verify();
  }, [searchParams, router, showToast]);

  return (
    <div className="flex flex-col bg-dark min-h-screen p-4 w-screen overflow-hidden items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/2 gap-6 flex flex-col w-[350px] md:w-[500px] p-8 rounded-3xl border border-white/10 items-center text-center"
      >
        {status === "loading" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CircleNotch size={64} className="text-base" />
            </motion.div>
            <p className="text-white/90 text-lg">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle size={64} className="text-base" weight="fill" />
            </motion.div>
            <p className="text-white/90 text-lg">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <XCircle size={64} className="text-red-500" weight="fill" />
            </motion.div>
            <p className="text-white/90 text-lg">{message}</p>
            <Link
              href="/auth"
              className="mt-4 px-6 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-colors"
            >
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

const LoadingFallback = () => {
  return (
    <div className="flex flex-col bg-dark min-h-screen p-4 w-screen overflow-hidden items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/2 gap-6 flex flex-col w-[350px] md:w-[500px] p-8 rounded-3xl border border-white/10 items-center text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircleNotch size={64} className="text-base" />
        </motion.div>
        <p className="text-white/90 text-lg">Verifying your magic link...</p>
      </motion.div>
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
