"use client";

import Image from "next/image";
import { CaretDownIcon } from "@phosphor-icons/react";

export const Header = () => {
  return (
    <header className="w-full px-16 py-6 flex justify-between items-center">
      <p className="text-white text-3xl font-semibold">Welcome Back, Tayo!</p>

      <button className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/4 hover:bg-white/5 transition-colors bg-white/4">
        <Image
          src="/logo.svg"
          width="30"
          height="30"
          alt="User avatar"
          className="rounded-full"
        />
        <span className="text-white/80 font-bold text-xl">Tayo</span>
        <CaretDownIcon size={20} className="text-white/60" />
      </button>
    </header>
  );
};
