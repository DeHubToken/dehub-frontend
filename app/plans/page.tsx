"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";

import { BJ } from "@/components/icons/bj";
import { CheckCircle } from "@/components/icons/check-circle";
import CrossCircled from "@/components/icons/cross-circled";
import { Pound } from "@/components/icons/pound";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { createOrUpdate } from "@/services/subscription-plans";

import { SubscriptionModalPreView } from "./components/subscription-preview";
import { useActiveWeb3React } from "@/hooks/web3-connect";

export default function Page() {
  const {account }= useActiveWeb3React()
  const form = useForm({
    defaultValues: {
      tiers: [
        {
          name: "",
          description: "",
          duration: 1,
          benefits: [],
          price: 0,
          currency: "USDT"
        }
      ]
      ,account
    }
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors }
  } = form;
  const { tiers } = watch();
  console.log(tiers);
  const fields = useFieldArray({ control, name: "tiers" });

  // Submit handler
  const onSubmit = async (subscriptions: any) => {
    // Add your API call logic here
    console.log("Submitting data:", subscriptions);

    const data = await createOrUpdate(subscriptions);
    console.log("api resp", data);
    try {
      console.log("Submission successful");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen w-full px-2 py-32 sm:px-6">
          <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
            <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
              <div className="h-auto w-full space-y-2">
                <h1 className="text-4xl sm:text-5xl">Subscription Tiers </h1>
                <p className="text-lg">Customize your subscription tiers</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap sm:justify-end">
                <div className="flex w-full items-stretch justify-center sm:w-auto">
                  {/* <Button
                    className="rounded-l-full"
                    size="sratch"
                    onClick={() => {
                      if (fields.fields.length > 4) return;
                      // fields.append({
                      //   name: "Basic",
                      //   description: "Basic description",
                      //   duration: 1,
                      //   benefits: ["Benefit 1"],
                      //   price: 0,
                      //   currency: "GBP"
                      // });
                    }}
                  >
                    <Plus />
                  </Button> */}
                  {/* <div className="flex w-max items-center justify-center bg-black/25 px-4 py-2">
                    {fields.fields.length} tiers
                  </div> */}
                  {/* <Button
                    className="rounded-r-full"
                    size="sratch"
                    onClick={() => {
                      if (fields.fields.length === 1) return;
                      fields.remove(fields.fields.length - 1);
                    }}
                  >
                    <Minus />
                  </Button> */}
                </div>
                <SubscriptionModalPreView tiers={tiers} />

                <Button variant="gradientOne" size="sratch">
                  Save
                </Button>
                {/* <Button variant="gradientOne" size="sratch">
                  Publish
                </Button> */}
              </div>
            </div>

            <div className="flex h-auto w-full flex-col items-start justify-start gap-16">
              {fields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex h-auto w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-gray-300/25"
                >
                  <div className="w-full border-b border-gray-300/25 bg-gray-400/10 p-4 text-center">
                    <h1 className="text-2xl">New Tier </h1>
                  </div>

                  <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                    <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                      <h1 className="text-xl">Tiers Name</h1>
                    </div>
                    <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%]  ">
                      <input
                        placeholder="Basic Tier"
                        className=" w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
                        {...register(`tiers.${index}.name`, { required: "Tier name is required" })}
                      />
                      {errors.tiers?.[index]?.name && (
                        <p className="text-red-500">{errors.tiers[index].name.message} </p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                    <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                      <h1 className="text-xl">Description</h1>
                    </div>
                    <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                      <textarea
                        placeholder="Tier description here"
                        className="  w-full resize-none border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0"
                        rows={2}
                        {...register(`tiers.${index}.description`, {
                          required: "Tier description is required"
                        })}
                      />
                      {errors.tiers?.[index]?.description && (
                        <p className="text-red-500">{errors.tiers[index].description.message}</p>
                      )}
                    </div>
                  </div>

                  {/* row-3 */}
                  <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                    <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                      <h1 className="text-xl">Duration</h1>
                    </div>
                    {/* <SetDuration  /> */}
                    <SetDuration index={index} />
                  </div>

                  <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                    <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                      <h1 className="text-xl">Benefits</h1>
                    </div>
                    <BenefitList control={control} tierIndex={index} />
                  </div>

                  <div className="flex w-full flex-wrap items-stretch justify-start">
                    <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                      <h1 className="text-xl">Price</h1>
                    </div>
                    <div className="flex w-full max-w-full flex-[0_0_100%] items-stretch justify-start sm:max-w-[70%] sm:flex-[0_0_70%]">
                      <div className="w-full max-w-[40%] flex-[0_0_40%] border-r border-gray-300/25 sm:max-w-[30%] sm:flex-[0_0_30%]">
                        <CurrencySelect tierIndex={index} />
                      </div>
                      <div className="w-full max-w-[60%] flex-[0_0_60%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                        <input
                          type="number"
                          min={0}
                          placeholder="Enter price"
                          className="h-full w-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-white focus:ring-0 sm:py-2"
                          {...register(`tiers.${index}.price`, {
                            required: "Tier price is required"
                          })}
                        />
                        {errors.tiers?.[index]?.price && (
                          <p className="text-red-500">{errors.tiers[index].price.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

const SetDuration = ({ index }: { index: number }) => {
  const { control } = useFormContext(); // Use form context to manage state in form

  // Duration objects with titles and values
  const durations = [
    { title: "1 month", value: 1 },
    { title: "3 months", value: 3 },
    { title: "6 months", value: 6 },
    { title: "1 year", value: 12 },
    { title: "lifetime", value: 0 }
  ];

  return (
    <Controller
      name={`tiers[${index}].duration`} // Dynamic form field for each tier's duration
      control={control}
      defaultValue={durations[0].value} // Default value for duration (1 month)
      render={({ field }) => {
        const currentDuration = durations.find((d) => d.value === field.value); // Find the duration object by value

        return (
          <div className="flex w-full max-w-full flex-[0_0_100%] items-center justify-between pl-8 sm:max-w-[70%] sm:flex-[0_0_70%]">
            <p className="text-lg">{currentDuration?.title}</p>
            <div className="flex items-center justify-end gap-1">
              <Button
                className="h-full rounded-none px-5 py-6 sm:px-10"
                type="button"
                onClick={() => {
                  const nextIndex = durations.findIndex((d) => d.value === field.value) + 1; // Find the current index
                  if (nextIndex < durations.length) {
                    field.onChange(durations[nextIndex].value); // Update field with the next duration
                  }
                }}
              >
                <Plus />
              </Button>
              <Button
                type="button"
                className="h-full rounded-none px-5 py-6 sm:px-10"
                onClick={() => {
                  const prevIndex = durations.findIndex((d) => d.value === field.value) - 1; // Find the current index
                  if (prevIndex >= 0) {
                    field.onChange(durations[prevIndex].value); // Update field with the previous duration
                  }
                }}
              >
                <Minus />
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
};
function BenefitList({ control, tierIndex }: any) {
  const [benefit, setBenefit] = useState("");

  // Accessing the correct field array
  const {
    fields: benefitFields,
    append: addBenefit,
    remove: removeBenefit
  }: any = useFieldArray({
    control,
    name: `tiers[${tierIndex}].benefits`
  });

  console.log("benefitFields", benefitFields);
  return (
    <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
      <div className="ml-3 mt-3 flex flex-wrap gap-5">
        {benefitFields.map((field: { id: string; value: string }, n: number) => (
          <div
            key={field.id}
            className="relative flex select-none justify-center gap-1 rounded-lg bg-theme-background px-8 py-6 text-center text-lg text-gray-500 outline-none sm:py-2"
          >
            <CheckCircle />
            {field.value}
            <span
              onClick={() => removeBenefit(n)}
              className="absolute -right-1 -top-2 cursor-pointer text-red-600"
            >
              <CrossCircled />
            </span>
          </div>
        ))}

        <input
          placeholder="Enter Benefit"
          onChange={(e) => setBenefit(e.target.value)}
          value={benefit}
          maxLength={100}
          className="h-full border-none bg-theme-background px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
        />
      </div>

      <div className="grid h-24 w-full place-items-center">
        <button
          type="button"
          onClick={() => {
            if (!benefit) return;
            addBenefit({ value: benefit }); // Appending new benefit correctly
            setBenefit(""); // Reset input
          }}
          className="flex items-center gap-2 rounded px-4 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-theme-mine-shaft-dark"
        >
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
const CurrencySelect = ({ tierIndex }: { tierIndex: number }) => {
  const { control } = useFormContext(); // Get control from useFormContext() to manage state across form
  // const { fields } = useFieldArray({ control, name: "tiers" }); // Use useFieldArray to manage the tiers dynamically

  // The controller is now managing the field value for each tier
  return (
    <Controller
      name={`tiers[${tierIndex}].currency`} // This maps to the currency field of the correct tier
      control={control}
      defaultValue="" // Set a default value for the currency
      render={({ field }) => (
        <Select
          {...field} // Spread the field to control its value and changes
          value={field.value} // Use the field value from react-hook-form
          onValueChange={(value: string) => field.onChange(value)} // Update the field value on change
        >
          <SelectTrigger className="h-full w-full min-w-32 rounded-none bg-transparent dark:bg-transparent">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DHB">DHB</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
};
