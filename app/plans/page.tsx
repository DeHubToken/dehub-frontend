"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";

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
  const form = useForm({
    defaultValues: {
      tiers: [
        {
          name: "Basic",
          description: "Basic description",
          duration: 1,
          benefits: ["Benefit 1"],
          price: 0,
          currency: "GBP"
        }
      ]
    }
  });

  const fields = useFieldArray({
    control: form.control,
    name: "tiers"
  });

  return (
    <FormProvider {...form}>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
          <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
            <div className="h-auto w-full space-y-2">
              <h1 className="text-4xl sm:text-5xl">Subscription Tiers </h1>
              <p className="text-lg">Customize your subscription tiers</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap sm:justify-end">
              <div className="flex w-full items-stretch justify-center sm:w-auto">
                <Button
                  className="rounded-l-full"
                  size="sratch"
                  onClick={() => {
                    if (fields.fields.length > 3) return;
                    fields.append({
                      name: "Basic",
                      description: "Basic description",
                      duration: 1,
                      benefits: ["Benefit 1"],
                      price: 0,
                      currency: "GBP"
                    });
                  }}
                >
                  <Plus />
                </Button>
                <div className="flex w-max items-center justify-center bg-black/25 px-4 py-2">
                  {fields.fields.length} tiers
                </div>
                <Button
                  className="rounded-r-full"
                  size="sratch"
                  onClick={() => {
                    if (fields.fields.length === 1) return;
                    fields.remove(fields.fields.length - 1);
                  }}
                >
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

          <div className="flex h-auto w-full flex-col items-start justify-start gap-16">
            {fields.fields.map((field, index) => (
              <div
                key={field.id}
                className="flex h-auto w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-gray-300/25"
              >
                <div className="w-full border-b border-gray-300/25 bg-gray-400/10 p-4 text-center">
                  <h1 className="text-2xl">Tier {index + 1}</h1>
                </div>

                <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                  <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                    <h1 className="text-xl">Tiers Name</h1>
                  </div>
                  <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                    <input
                      placeholder="Basic Tier"
                      className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                  <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                    <h1 className="text-xl">Description</h1>
                  </div>
                  <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                    <textarea
                      placeholder="Tier description here"
                      className="h-full w-full resize-none border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0"
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

                <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                  <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                    <h1 className="text-xl">Benefits</h1>
                  </div>
                  <BenefitList />
                </div>

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
                        type="number"
                        min={0}
                        placeholder="Enter price"
                        className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0 sm:py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

function BenefitList() {
  return (
    <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
      <div>
        <input
          placeholder="Benefit 1"
          className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
        />
      </div>

      <div className="grid h-24 w-full place-items-center">
        <button className="flex items-center gap-2 rounded px-4 py-2 transition-colors hover:bg-gray-200 hover:dark:bg-theme-mine-shaft-dark">
          <Plus className="size-5" />
          <span className="text-lg">Add another benefit</span>
        </button>
      </div>
    </div>
  );
}

const DHB = (
  <div className="flex items-center gap-4">
    <Image src="/icons/tokens/dhb.png" width={24} height={24} alt="dhb" className="size-10" />
    <span className="text-lg">DHB</span>
  </div>
);

const USDT = (
  <div className="flex items-center gap-4">
    <Image src="/icons/tokens/usdt.png" width={24} height={24} alt="usdt" className="size-10" />
    <span className="text-lg">USDT</span>
  </div>
);

const USDC = (
  <div className="flex items-center gap-4">
    <Image src="/icons/tokens/usdc.png" width={24} height={24} alt="usdc" className="size-10" />
    <span className="text-lg">USDC</span>
  </div>
);

const ETH = (
  <div className="flex items-center gap-4">
    <div className="grid size-10 place-items-center rounded-full bg-white/5">
      <Image
        src="/icons/tokens/eth.png"
        width={24}
        height={24}
        alt="eth"
        className="size-full p-2"
      />
    </div>
    <span className="text-lg">ETH</span>
  </div>
);

function CurrencySelect() {
  const [value, setValue] = useState("DHB");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="h-full w-full min-w-32 rounded-none bg-transparent dark:bg-transparent">
        <SelectValue placeholder={DHB} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DHB">{DHB}</SelectItem>
        <SelectItem value="USDT">{USDT}</SelectItem>
        <SelectItem value="USDC">{USDC}</SelectItem>
        <SelectItem value="ETH">{ETH}</SelectItem>
      </SelectContent>
    </Select>
  );
}
