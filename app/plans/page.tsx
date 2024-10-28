"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { BJ } from "@/components/icons/bj";
import { Pound } from "@/components/icons/pound";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Page() {
  return (
    <div className="min-h-screen w-full px-2 py-32 sm:px-6">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
        {/* header */}
        <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
          <div className="h-auto w-full space-y-2">
            <h1 className="text-4xl sm:text-5xl">Subscription Tiers </h1>
            <p className="text-lg">Customize your subscription tiers</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap sm:justify-end">
            <div className="flex w-full items-stretch justify-center sm:w-auto">
              <Button className="rounded-l-full" size="sratch">
                <Plus />
              </Button>
              <div className="flex w-max items-center justify-center bg-black/25 px-4 py-2">
                2 tiers
              </div>
              <Button className="rounded-r-full" size="sratch">
                <Minus />
              </Button>
            </div>
            <Button variant="default" size="sratch" className="rounded-full">
              Preview
            </Button>
            <Button variant="gradientOne" size="sratch">
              Publish
            </Button>
          </div>
        </div>

        {/* tiers list */}
        <div className="flex h-auto w-full flex-col items-start justify-start gap-16">
          {/* tier-box */}
          <div className="flex h-auto w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-gray-300/25">
            {/* header */}
            <div className="w-full border-b border-gray-300/25 bg-gray-400/10 p-4 text-center">
              <h1 className="text-2xl">Tier 1</h1>
            </div>

            {/* row-1 */}
            <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
              <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                <h1 className="text-xl">Tiers Name</h1>
              </div>
              <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                <input
                  placeholder="Basic Tier"
                  className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0 sm:py-2"
                />
              </div>
            </div>

            {/* row-2 */}
            <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
              <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                <h1 className="text-xl">Description</h1>
              </div>
              <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                <textarea
                  placeholder="Tier description here"
                  className="h-full w-full resize-none border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0"
                  rows={2}
                />
              </div>
            </div>

            {/* row-3 */}
            <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
              <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                <h1 className="text-xl">Duration</h1>
              </div>
              <div className="flex w-full max-w-full flex-[0_0_100%] items-center justify-between pl-8 sm:max-w-[70%] sm:flex-[0_0_70%]">
                <p className="text-lg">1 month</p>
                <div className="flex items-center justify-end gap-1">
                  <Button className="h-full rounded-none px-5 py-6 sm:px-10">
                    <Plus />
                  </Button>
                  <Button className="h-full rounded-none px-5 py-6 sm:px-10">
                    <Minus />
                  </Button>
                </div>
              </div>
            </div>

            {/* row-4 */}
            <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
              <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                <h1 className="text-xl">Benefits</h1>
              </div>
              <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                <input
                  placeholder="Basic Tier"
                  className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0 sm:py-2"
                />
              </div>
            </div>

            {/* row-5 */}
            <div className="flex w-full flex-wrap items-stretch justify-start">
              <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                <h1 className="text-xl">Price</h1>
              </div>
              <div className="flex w-full max-w-full flex-[0_0_100%] items-stretch justify-start sm:max-w-[70%] sm:flex-[0_0_70%]">
                <div className="w-full max-w-[40%] flex-[0_0_40%] border-r border-gray-300/25 sm:max-w-[30%] sm:flex-[0_0_30%]">
                  <CurrencySelect />
                </div>
                <div className="w-full max-w-[60%] flex-[0_0_60%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                  <input
                    placeholder="Enter price"
                    value={10.0}
                    className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0 sm:py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pound = (
  <div className="flex items-center gap-4">
    <Pound className="size-8 sm:size-10" />
    <span className="text-lg">GBP</span>
  </div>
);

const bj = (
  <div className="flex items-center gap-4">
    <BJ className="size-8 sm:size-10" />
    <span className="text-lg">BJ</span>
  </div>
);

function CurrencySelect() {
  const [value, setValue] = useState("GBP");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="h-full w-full min-w-32 rounded-none bg-transparent dark:bg-transparent">
        <SelectValue placeholder={pound} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="GBP">{pound}</SelectItem>
        <SelectItem value="BJ">{bj}</SelectItem>
      </SelectContent>
    </Select>
  );
}
