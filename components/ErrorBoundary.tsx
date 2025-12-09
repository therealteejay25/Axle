"use client";
import React from "react";
import { XCircle, ArrowLeft } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#000] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/4 rounded-4xl p-8 max-w-md w-full border border-white/10 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4 flex justify-center"
            >
              <XCircle size={64} className="text-red-500" weight="fill" />
            </motion.div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Something went wrong
            </h2>
            <p className="text-white/60 text-sm mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-colors"
              >
                Reload Page
              </button>
              <Link
                href="/app"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

