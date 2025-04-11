"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { Minus, Plus, Trash } from "lucide-react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useWaitForTransaction } from "wagmi";

import { ChainIconById } from "@/app/components/ChainIconById";

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

import { useSubscriptionContract } from "@/hooks/use-web3";
import { chains, useActiveWeb3React } from "@/hooks/web3-connect";

import { createPlan, updatePlan } from "@/services/subscription-plans";

import { supportedNetworks } from "@/web3/configs";

import { chainIcons, durations, SB_ADDRESS, supportedTokens } from "@/configs";

import PublishOnChain from "./publish-on-chain";
import { SubscriptionModalPreView } from "./subscription-preview";

type FormValues = {
  tier: {
    chains: {
      token: string;
    }[];
  };
};

export default function Form({ plan, getTiers }: any) {
  const { account, chainId } = useActiveWeb3React();
  const router = useRouter();
  const planId = plan != undefined ? plan.id : null;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (plan?.address && plan?.address != account?.toLowerCase()) {
      toast.error("You are not the owner.");
      router.push("/"); // Redirect to home
    }
  }, [plan, account]);

  const form = useForm({
    defaultValues: {
      tier: {
        tier: plan?.tier ? plan?.tier : 1,
        name: plan?.name ? plan?.name : "",
        description: plan?.description ? plan?.description : "",
        duration: plan?.duration ? plan?.duration : 1,
        address: plan?.address ? plan?.address : account,
        chains: plan?.chains ? plan?.chains : [],
        benefits:
          plan?.benefits?.map((v: string) => {
            return { value: v };
          }) ?? []
      }
    }
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    formState: { errors, isDirty }
  } = form;

  const { tier } = watch();
  const onSubmit = async (plan: any) => {
    // Add your API call logic here
    let { benefits, ...tier } = plan.tier;
    benefits = benefits.map((b: any) => b.value);
    if (benefits.length < 2) {
      toast.error("Please add at least two benefits.");
      return;
    }
    plan = { ...tier, benefits };
    try {
      setIsPending(true);
      const data: any = planId !== null ? await updatePlan(plan, planId) : await createPlan(plan);
      if (data?.error) {
        toast.error(data?.error);
        return;
      }
      if (planId) {
        reset();
        setIsPending(false);
        toast.success("plan Updated");
        router.push("/plans");
        return;
      }
      toast.success("plan created");
      setIsPending(false);
      reset();
      await getTiers();
      return;
    } catch (error: any) {
      toast.error(error.message);
      setIsPending(false);

      console.error("Submission error:", error);
    }
  };

  // Check if any chain has `isPublished: true` or if the whole plan is published
  const isPlanPublished = plan?.chains.some((chain: any) => chain.isPublished) || plan?.isPublished;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
          <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
            <div className="h-auto w-full space-y-2">
              <h1 className="text-4xl sm:text-5xl">Subscription tiers </h1>
              <p className="text-lg">Customize your subscription tiers</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap sm:justify-end">
              <div className="flex w-full items-stretch justify-center sm:w-auto"></div>
              <SubscriptionModalPreView tiers={[tier]} />
              <Button disabled={isPending} variant="gradientOne" size="sratch">
                {isPending ? "Submitting..." : plan?.id ? "Save Edit" : "Save"}
              </Button>
            </div>
          </div>

          <div className="flex h-auto w-full flex-col items-start justify-start gap-16">
            <div className="flex h-auto w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-gray-300/25">
              <div className="w-full border-b border-gray-300/25 bg-gray-400/10 p-4 text-center">
                <h1 className="text-2xl">Tier {tier.tier}</h1>
              </div>

              <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                  <h1 className="text-xl">Tiers Name</h1>
                </div>
                <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%]  ">
                  <input
                    placeholder="Basic tier"
                    className=" w-full border-none bg-theme-neutrals-900 px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
                    {...register(`tier.name`, { required: "Tier Name is Required" })}
                  />
                  {errors.tier?.name?.message && (
                    <p className="text-red-500">
                      {typeof errors.tier.name.message === "string"
                        ? errors.tier.name.message
                        : "Invalid error message"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                  <h1 className="text-xl">Description</h1>
                </div>
                <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
                  <textarea
                    placeholder="tier description here"
                    className="  w-full resize-none border-none bg-theme-neutrals-900 px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0"
                    rows={2}
                    {...register(`tier.description`, {
                      required: "Tier Description Is Required"
                    })}
                  />
                  {errors.tier?.description?.message && (
                    <p className="text-red-500">
                      {typeof errors.tier.description.message === "string"
                        ? errors.tier.description.message
                        : "Invalid error message"}
                    </p>
                  )}
                </div>
              </div>

              {/* row-3 */}
              <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                  <h1 className="text-xl">Duration</h1>
                </div>
                <SetDuration control={control} form={form} isPublished={isPlanPublished} />
              </div>

              <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
                <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
                  <h1 className="text-xl">Benefits</h1>
                </div>
                <BenefitList control={control} />
              </div>

              <ChainSection
                deployedPlan={plan}
                tier={tier}
                control={control}
                onPublish={() => {
                  router.push("/plans");
                }}
                chainId={chainId}
                isDirty={isDirty}
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export const SetDuration = ({
  control,
  form,
  isPublished
}: {
  control: any;
  form: any;
  isPublished: boolean;
}) => {
  const { setValue } = form;
  return (
    <Controller
      name={`tier.duration`} // Dynamic form field for each tier's duration
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
                    setValue("tier.tier", durations[nextIndex].tier);
                  }
                }}
                disabled={isPublished}
              >
                <Plus />
              </Button>
              <Button
                type="button"
                className="sm:px-89 h-full rounded-none px-5 py-6"
                onClick={() => {
                  const prevIndex = durations.findIndex((d) => d.value === field.value) - 1; // Find the current index
                  if (prevIndex >= 0) {
                    field.onChange(durations[prevIndex].value); // Update field with the previous duration
                    setValue("tier.tier", durations[prevIndex].tier);
                  }
                }}
                disabled={isPublished}
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
export function BenefitList({ control, tierIndex }: any) {
  const [benefit, setBenefit] = useState("");

  // Accessing the correct field array
  const {
    fields: benefitFields,
    append: addBenefit,
    remove: removeBenefit
  }: any = useFieldArray({
    control,
    name: `tier.benefits`
  });

  return (
    <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_70%]">
      <div className="ml-3 mt-3 flex flex-wrap gap-5">
        {benefitFields.map((field: { id: string; value: string }, n: number) => (
          <div
            key={field.id}
            className="relative flex select-none justify-center gap-1 rounded-lg bg-theme-background px-8 py-6  text-lg text-gray-500 outline-none sm:py-2"
          >
            <CheckCircle className=" absolute left-1" />
            {field.value}
            <span
              onClick={() => removeBenefit(n)}
              className="absolute -top-2 right-1 cursor-pointer text-red-600"
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
          className="h-full border-none bg-theme-neutrals-900 px-8 py-6 text-lg outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2"
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
          className="flex items-center gap-2 rounded px-4 py-2 transition-colors hover:bg-theme-mine-shaft-dark"
        >
          <Plus className="size-5" />
          <span className="text-lg">Add benefit</span>
        </button>
      </div>
    </div>
  );
}

export const ChainSection = ({ deployedPlan, tier, control, onPublish, chainId, isDirty }: any) => {
  // Get form context for `register` if not explicitly passed
  const { register } = useFormContext();
  const { remove } = useFieldArray({
    control,
    name: "tier.chains" // Name of the field in the form schema
  });

  return (
    <div className="flex w-full flex-wrap items-stretch justify-start border-b border-gray-300/25">
      {/* Section Header */}
      <div className="w-full max-w-full flex-[0_0_100%] border-r border-gray-300/25 bg-gray-400/10 p-6 sm:max-w-[30%] sm:flex-[0_0_30%]">
        <h1 className="text-xl">Chains</h1>
      </div>

      {/* Chain List Section */}
      <div className="w-full max-w-full flex-[0_0_100%] sm:max-w-[70%] sm:flex-[0_0_60%]">
        {tier?.chains?.map((field: any, index: number) => (
          <div
            className="mb-4 mt-5 flex w-full flex-wrap items-center gap-5  pl-5 pr-5"
            key={field.id}
          >
            {/* Chain ID or Label */}
            <div className="w-auto flex-shrink-0  sm:w-auto sm:text-left">
              <ChainIconById chainId={field.chainId} label={true} />
            </div>

            {/* Currency Select */}
            <div className="md:[w-auto] w-auto focus:[box-shadow:none] sm:w-40 md:w-48">
              <CurrencySelect
                control={control}
                chainId={field.chainId}
                index={index}
                disabled={field.isPublished}
              />
            </div>

            {/* Price Input */}
            <div className="w-auto sm:w-40 md:w-48">
              <div className="flex items-center justify-center gap-5 align-middle">
                <label> Amount: </label>
                <input
                  type="number"
                  min={0}
                  style={{ minWidth: 100 }}
                  placeholder="Enter price"
                  disabled={field.isPublished}
                  className="w-full rounded-md border bg-gray-100 px-4 py-2  text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register(`tier.chains.${index}.price`, {
                    valueAsNumber: true,
                    required: "Amount is Required",
                    validate: (value) => {
                      if (value <= 0) {
                        toast.error("Amount should be greater than 0");
                        return "Amount should be greater than 0";
                      }
                    }
                  })}
                />
              </div>
            </div>

            {/* Conditional Delete Button (only for unpublished chains) */}
            {(field.temp || !field.isPublished) && (
              <div className="sm:w-40 md:w-48">
                <Button
                  variant="gradientOne"
                  type="button"
                  onClick={() => remove(index)} // Removes the chain from the array
                  className="w-full text-sm"
                >
                  Delete
                </Button>
              </div>
            )}

            <PublishOnChain
              disabled={field.isPublished || field.temp || isDirty}
              field={field}
              chainId={chainId}
              deployedPlan={deployedPlan}
            />
          </div>
        ))}

        {/* Add Chain Dropdown */}
        <div className="mt-4 grid h-24 w-full place-items-center">
          <AddChainDropdown tier={tier} control={control} />
        </div>
      </div>
    </div>
  );
};

const AddChainDropdown: React.FC<any> = ({ tier, control }) => {
  const { append: appendChain, fields: chainFields } = useFieldArray({
    control,
    name: "tier.chains"
  });

  // Function to check if a chain already exists by its chainId
  const isChainExist = (chainId: number) => {
    return tier?.chains?.some((chain: any) => chain.chainId === chainId);
  };

  return (
    <div className="grid h-24 w-full place-items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded px-4 py-2 transition-colors hover:bg-theme-mine-shaft-dark"
          >
            <Plus className="size-5" />
            <span className="text-lg">Add chain</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {supportedNetworks
            .filter((network) => [56, 8453, 97].includes(network.chainId))
            .map((network) => (
              <DropdownMenuItem
                key={network.chainId}
                onClick={() => {
                  // Only append if the chainId is not already in the list
                  if (!isChainExist(network.chainId)) {
                    appendChain({
                      chainId: network.chainId,
                      price: 0,
                      token: "",
                      isPublished: false,
                      temp: true
                    });
                  } else {
                    alert(`Chain with ID ${network.chainId} already exists.`);
                  }
                }}
              >
                {network.label}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// CurrencySelect Component to correctly bind each chain's token field
export const CurrencySelect = ({
  control,
  chainId,
  index,
  disabled
}: {
  control: any;
  chainId: number;
  index: number;
  disabled: boolean;
}) => {
  const {
    setValue,
    trigger,
    formState: { errors }
  } = useFormContext<FormValues>();

  const handleValidation = async () => {
    const isValid = await trigger(`tier.chains.${index}.token`); // Validate the token field
    if (!isValid) {
      toast.error("Token is required"); // Show toast message if validation fails
    }
    return isValid;
  };

  return (
    <Controller
      name={`tier.chains.${index}.token`} // Correct path for the token of the specific chain
      control={control}
      defaultValue="" // Set a default value for the currency
      rules={{ required: true }}
      render={({ field }) => (
        <>
          <Select
            {...field} // Spread the field to control its value and changes
            value={field.value} // Use the field value from react-hook-form
            onValueChange={(value: string) => {
              field.onChange(value);
              handleValidation();
            }} // Update the field value on change
            disabled={disabled}
          >
            <SelectTrigger className="h-full min-w-32 rounded-none bg-transparent text-base dark:bg-transparent">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {supportedTokens
                .filter((chain) => [56, 8453, 97].includes(chain.chainId))
                .filter((t) => t.chainId == chainId && t.isSubscriptionSupported)
                .map((token, i: number) => (
                  <SelectItem key={i} value={token.address}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={token.iconUrl}
                        width={15}
                        height={15}
                        alt={token.address}
                        className="size-6"
                      />
                      <span className="text-lg">{token.label}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors?.tier?.chains?.[index]?.token && (
            <p className="text-sm text-red-500">Token is required</p>
          )}
        </>
      )}
    />
  );
};
