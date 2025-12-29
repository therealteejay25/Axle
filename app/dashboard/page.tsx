"use client";

import Link from "next/link";
import {
  ArrowUpRightIcon,
  SparkleIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
export default function DashboardPage() {

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <h1 className="text-4xl font-extrabold text-white tracking-tight">
        Welcome back, Tayo!
      </h1>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-3 w-full">
          <div className="bg-black/20 h-80 flex flex-col gap-8 border border-black/40 overflow-hidden rounded-3xl p-4 w-4/7">
          <div className="bg-white/3 border border-white/5 w-fit text-sm rounded-full px-5 py-2.5 text-white/35">
          Recently Run
          </div>
          <div className="bg-black/20 overflow-scroll flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2.5 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <SparkleIcon size={26} className="text-base" weight="fill" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full px-7 cursor-pointer py-2.5">View</Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2.5 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <SparkleIcon size={26} className="text-base" weight="fill" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full px-7 cursor-pointer py-2.5">View</Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2.5 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <SparkleIcon size={26} className="text-base" weight="fill" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full px-7 cursor-pointer py-2.5">View</Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2.5 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <SparkleIcon size={26} className="text-base" weight="fill" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full px-7 cursor-pointer py-2.5">View</Button>
          </div>
          </div>
          </div>
          <div className="bg-black/20 h-80 flex flex-col gap-8 border border-black/40 overflow-hidden rounded-3xl p-6 w-3/7">
            <h3 className="text-lg font-semibold">Live Tracker</h3>
            <div className="h-full w-full flex justify-center items-center">
              <p className="text-white/12 text-sm">There are no running agents for now...</p>
            </div>
          </div>
        </div>
      <div className="flex gap-3 w-full mb-4">
        <div className="bg-black/20 h-80 flex flex-col gap-8 border border-black/40 overflow-hidden rounded-3xl p-4 w-1/2"></div>
        <div className="bg-black/20 h-80 flex flex-col gap-8 border border-black/40 overflow-hidden rounded-3xl p-4 w-1/2">
          <div className="bg-black/20 overflow-scroll flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <Image src="/github.svg" alt="Github Icon" height={48} width={48} className="size-8" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full hover:bg-base/6 p-2.5 text-base bg-base/10 cursor-pointer"><ArrowUpRightIcon className="size-5 text-base" /></Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <Image src="/slack.svg" alt="Github Icon" height={48} width={48} className="size-8" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full hover:bg-base/6 p-2.5 text-base bg-base/10 cursor-pointer"><ArrowUpRightIcon className="size-5 text-base" /></Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <Image src="/github.svg" alt="Github Icon" height={48} width={48} className="size-8" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full hover:bg-base/6 p-2.5 text-base bg-base/10 cursor-pointer"><ArrowUpRightIcon className="size-5 text-base" /></Button>
          </div>
          <div className="bg-background rounded-xl flex justify-between items-center p-2.5">
            <div className="flex gap-3.5">
            <div className="p-2 h-fit rounded-xl bg-white/2 border border-white/3 w-fit">
            <Image src="/slack.svg" alt="Github Icon" height={48} width={48} className="size-8" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold">Daily GitHub Scanner</h3>
              <p className="text-xs text-white/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
            </div>
            <Button variant="primary" size="sm" className="font-medium rounded-full hover:bg-base/6 p-2.5 text-base bg-base/10 cursor-pointer"><ArrowUpRightIcon className="size-5 text-base" /></Button>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
