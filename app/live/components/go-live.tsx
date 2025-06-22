"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CreatableTagInput } from "@/components/form/tag-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import useTokenBalance from "@/hooks/use-token-balance";
import { useUser } from "@/hooks/use-user";
import { useStreamCollectionContract, useStreamControllerContract } from "@/hooks/use-web3";

import { createLiveStream } from "@/services/broadcast/broadcast.service";
import { minNft } from "@/services/nfts/mint";

import { STREAM_CONTROLLER_CONTRACT_ADDRESSES, supportedNetworks } from "@/web3/configs";
import { filteredStreamInfo, formatDateToInputValue } from "@/web3/utils/format";
import { calculateGasMargin, GAS_MARGIN, mintWithBounty } from "@/web3/utils/transaction";
import { getAuthObject, getAuthParams, getSignInfo } from "@/web3/utils/web3-actions";

import {
  streamInfoKeys,
  StreamStatus,
  supportedTokens,
  supportedTokensForLockContent,
  supportedTokensForPPV
} from "@/configs";

const streamStatusOptions = ["OFFLINE", "LIVE", "SCHEDULED"];

const liveStreamSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  thumbnail: z.any({ required_error: "Thumbnail is required" }),
  status: z.enum(["LIVE", "SCHEDULED"]).default(StreamStatus.LIVE),
  categories: z.array(z.string()),
  settings: z.object({
    enableChat: z.boolean().default(true),
    schedule: z.boolean().default(false),
    minTip: z.number().min(1000, { message: "Minimum tip must be at least 1000" }).default(1000),
    tipDelay: z.number().default(0)
  }),
  scheduledFor: z.date().optional(),

  // on chain stuffs
  lockContent: z.boolean().optional().default(false),
  lockToken: z.string().optional(),
  lockNetwork: z.string().optional(),
  lockAmount: z.string().optional(),
  payPerView: z.boolean().optional().default(false),
  ppvToken: z.string().optional(),
  ppvNetwork: z.string().optional(),
  ppvAmount: z.string().optional(),
  bounty: z.boolean().optional().default(false),
  bountyToken: z.string().optional(),
  bountyFirstViewers: z.string().optional(),
  bountyFirstComments: z.string().optional(),
  bountyAmount: z.string().optional(),
  streamInfo: z.record(z.any()).optional()
});

const delayOptions = [
  { value: 0, label: "No Delay" },
  { value: 30, label: "30 Seconds" },
  { value: 60, label: "1 Minute" },
  { value: 300, label: "5 Minutes" }
];

type LiveStreamFormValues = z.infer<typeof liveStreamSchema>;

type Props = { categories: string[] };

export default function GoLiveForm({ categories }: Props) {
  const { account, chainId, library, user } = useUser();

  const [thumbnailPreview, setThumbnailPreview] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [isloading, setIsLoading] = useState(false);

  const streamCollectionContract = useStreamCollectionContract();
  const streamController = useStreamControllerContract();
  const addTransaction = useAddRecentTransaction();
  const tokenBalances = useTokenBalance(false);
  const streamControllerContractAddress = useMemo(
    // @ts-expect-error no index with type number on STREAM_CONTROLLER_CONTRACT_ADDRESSES
    () => STREAM_CONTROLLER_CONTRACT_ADDRESSES[chainId],
    [chainId]
  );

  const router = useRouter();

  const form = useForm<LiveStreamFormValues>({
    resolver: zodResolver(liveStreamSchema),
    defaultValues: {
      title: "",
      status: StreamStatus.LIVE,
      description: "",
      thumbnail: "",
      categories: [],
      settings: { enableChat: true, schedule: false, minTip: 1000, tipDelay: 0 },
      streamInfo: {}
    }
  });

  // Lock Content
  const isLockedContent = form.watch("lockContent");
  const selectedLockToken = form.watch("lockToken");
  const lockNetwork = form.watch("lockNetwork");
  const lockAmount = form.watch("lockAmount");

  // Pay Per View
  const isPayPerView = form.watch("payPerView");
  const selectedPPVToken = form.watch("ppvToken");
  const ppvNetwork = form.watch("ppvNetwork");
  const ppvAmount = form.watch("ppvAmount");

  // Bounty
  const isBounty = form.watch("bounty");
  const bountyFirstViewers = form.watch("bountyFirstViewers");
  const bountyFirstComments = form.watch("bountyFirstComments");
  const bountyAmount = form.watch("bountyAmount");
  const selectedBountyToken = form.watch("bountyToken");

  useEffect(() => {
    const streamInfo = form.getValues("streamInfo");
    const lockContent = { [streamInfoKeys.isLockContent]: isLockedContent };
    const lockContentToken = { [streamInfoKeys.lockContentTokenSymbol]: selectedLockToken || "" };
    const lockContentChainIds = { [streamInfoKeys.lockContentChainIds]: [lockNetwork || ""] };
    const lockContentAmount = { [streamInfoKeys.lockContentAmount]: Number(lockAmount) || 0 };

    const payPerView = { [streamInfoKeys.isPayPerView]: isPayPerView };
    const payPerViewToken = { [streamInfoKeys.payPerViewTokenSymbol]: selectedPPVToken || "" };
    const payPerViewChainIds = { [streamInfoKeys.payPerViewChainIds]: [ppvNetwork || ""] };
    const payPerViewAmount = { [streamInfoKeys.payPerViewAmount]: Number(ppvAmount) || 0 };

    const bounty = { [streamInfoKeys.isAddBounty]: isBounty };
    const bountyToken = { [streamInfoKeys.addBountyTokenSymbol]: selectedBountyToken || "" };
    const bountyFirstXViewer = {
      [streamInfoKeys.addBountyFirstXViewers]: Number(bountyFirstViewers) || 0
    };
    const bountyFirstXComment = {
      [streamInfoKeys.addBountyFirstXComments]: Number(bountyFirstComments) || 0
    };
    const bountyAmountVal = { [streamInfoKeys.addBountyAmount]: Number(bountyAmount) || 0 };

    form.setValue("streamInfo", {
      ...streamInfo,
      ...lockContent,
      ...lockContentToken,
      ...lockContentChainIds,
      ...lockContentAmount,
      ...payPerView,
      ...payPerViewToken,
      ...payPerViewChainIds,
      ...payPerViewAmount,
      ...bounty,
      ...bountyToken,
      ...bountyFirstXViewer,
      ...bountyFirstXComment,
      ...bountyAmountVal
    });
  }, [
    isLockedContent,
    selectedLockToken,
    lockNetwork,
    lockAmount,
    isPayPerView,
    selectedPPVToken,
    ppvNetwork,
    ppvAmount,
    isBounty,
    selectedBountyToken,
    bountyFirstViewers,
    bountyFirstComments,
    bountyAmount
  ]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    maxSize: 20_971_520, // 20MB
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setThumbnailFile(file);
      form.setValue("thumbnail", url);
    }
  });

  const createStream = async (data: LiveStreamFormValues) => {
    const toastId = toast.loading("Starting stream creation process...");
    try {
      setIsLoading(true);
      if (!account || !user) {
        return toast.error("Please connect your wallet");
      }
      if (data.settings?.schedule) {
        if (!data.scheduledFor) {
          return toast.error("Please select a date and time for scheduled stream");
        }
        data.status = StreamStatus.SCHEDULED;
      } else {
        delete data.scheduledFor;
      }

      // Step 1: Get tokenId and auth details from backend
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("description", data.description as any);
      formData.append("postType", "live");
      formData.append("streamInfo", JSON.stringify(filteredStreamInfo(data.streamInfo as any)));
      formData.append(
        "category",
        data.categories?.length > 0 ? JSON.stringify(data.categories.map((e) => e)) : ""
      );
      formData.append("address", account.toLowerCase());
      formData.append("chainId", chainId.toString());
      const sigData = await getSignInfo(library, account);
      formData.append("sig", sigData.sig);
      formData.append("timestamp", sigData.timestamp);
      if (thumbnailFile) {
        formData.append("files", thumbnailFile);
      }
      const res = await minNft(formData);
      if (!res.success) {
        toast.error(res.error || "Metadata upload failed", { id: toastId });
        return;
      }

      const result = res.data;
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-ignore
        toast.error(result.error_msg || "NFT preparation failed", { id: toastId });
        return;
      }

      // 2. Mint NFT on-chain with details from backend
      toast.loading("Minting NFT...", { id: toastId });
      let txReceipt;

      if (data.streamInfo?.[streamInfoKeys.isAddBounty]) {
        const tokenSymbol = data.streamInfo[streamInfoKeys.addBountyTokenSymbol] || "DHB";
        const bountyToken = supportedTokens.find(
          (e) => e.symbol === tokenSymbol && e.chainId === chainId
        );
        const tx = await mintWithBounty(
          streamController,
          result.createdTokenId,
          result.timestamp,
          result.v,
          result.r,
          result.s,
          bountyToken,
          data.bountyAmount,
          data.bountyFirstViewers,
          data.bountyFirstComments
        );

        txReceipt = await tx.wait();
      } else {
        const estimatedGasPrice = await library.getGasPrice();
        const adjustedGasPrice = estimatedGasPrice.mul(110).div(100);

        const tx = await streamCollectionContract?.mint(
          result.createdTokenId,
          result.timestamp,
          result.v,
          result.r,
          result.s,
          [],
          1000,
          `${result.createdTokenId}.json`,
          {
            gasLimit: calculateGasMargin(
              await streamCollectionContract?.estimateGas.mint(
                result.createdTokenId,
                result.timestamp,
                result.v,
                result.r,
                result.s,
                [],
                1000,
                `${result.createdTokenId}.json`
              ),
              GAS_MARGIN
            ),
            gasPrice: adjustedGasPrice
          }
        );

        txReceipt = await tx.wait();
      }

      // 3. Create live stream with minted token ID
      toast.loading("Creating live stream...", { id: toastId });

      const authObject = await getAuthObject(library, account);
      let { thumbnail, ...payload } = data;
      data = { ...payload, ...authObject };
      const response = await createLiveStream(
        {
          ...data,
          tokenId: Number(result.createdTokenId),
          // tokenId: 1034,
          streamInfo: JSON.stringify(filteredStreamInfo(data.streamInfo as any))
        },
        thumbnailFile
      );

      if (response.success) {
        toast.success("Stream created successfully! Redirecting...", { id: toastId });
        router.push(`/live/${response.data._id}`);
      } else {
        toast.error("Failed to create stream");
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get token and network options
  const getTokens = (type: "lock" | "ppv" | "bounty") => {
    const tokens = {
      lock: supportedTokensForLockContent,
      ppv: supportedTokensForPPV,
      bounty: supportedTokens
    }[type];
    return tokens
      .filter((t) => t.chainId === chainId)
      .map((t) => ({
        value: t.symbol,
        label: t.label,
        iconUrl: t.iconUrl
      }));
  };

  const getNetworks = (tokenSymbol = "DHB", type: "lock" | "ppv") => {
    const token = (type === "lock" ? supportedTokensForLockContent : supportedTokensForPPV).find(
      (t) => t.symbol === tokenSymbol
    );
    return token ? supportedNetworks.filter((n) => n.chainId === token.chainId) : [];
  };

  return (
    <main className="h-auto min-h-screen w-full space-y-10 px-4 py-28 pt-6">
      <h1 className="text-4xl font-semibold">Broadcast</h1>
      <Form {...form}>
        {/* <form onSubmit={form.handleSubmit(createStream)} className="space-y-6"> */}
        <div className="flex h-auto w-full flex-wrap items-stretch justify-between gap-6 lg:gap-0">
          <div className="h-auto w-full max-w-full flex-[0_0_100%] space-y-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Stream Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" className="rounded-lg" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CreatableTagInput
                      isOptionDisabled={() => field.value?.length >= 3}
                      options={categories.map((category) => ({
                        label: category,
                        value: category
                      }))}
                      value={field.value?.map((category) => ({
                        label: category,
                        value: category
                      }))}
                      onOptionSelect={(value) => {
                        if (!value) return;
                        field.onChange(value.map((category) => category.value));
                      }}
                      placeholder="Add Categories"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex h-auto w-full max-w-full flex-[0_0_100%] flex-col items-center justify-center gap-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10  lg:max-w-[49%] lg:flex-[0_0_49%]">
            <FormField
              control={form.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden p-4 hover:border-gray-400"
                    >
                      <input {...getInputProps()} />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          className="size-full max-h-80 rounded-3xl object-cover"
                        />
                      ) : (
                        <p className="text-gray-500">Click or drag to upload a thumbnail</p>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex h-auto w-full flex-col items-start justify-start gap-8 rounded-2xl border border-gray-300/25 px-4 pb-6 pt-10 sm:gap-8 sm:p-10">
          <FormField
            control={form.control}
            name="settings.enableChat"
            render={({ field }) => (
              <FormItem className="w-full sm:w-auto">
                <FormControl>
                  <div className="flex w-full items-center justify-between space-x-4">
                    <label htmlFor="enableChat" className="block w-32">
                      Enable Chat
                    </label>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="enableChat"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settings.schedule"
            render={({ field }) => (
              <FormItem className="w-full sm:w-auto">
                <FormControl>
                  <div className="flex w-full flex-wrap items-center justify-between gap-y-4 space-x-4">
                    <label htmlFor="schedule" className="block w-32">
                      Schedule
                    </label>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) form.setValue("scheduledFor", undefined);
                      }}
                    />
                    {field.value && (
                      <FormField
                        control={form.control}
                        name="scheduledFor"
                        render={({ field: scheduleField }) => (
                          <FormItem className="w-full sm:w-auto">
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...scheduleField}
                                value={
                                  scheduleField.value
                                    ? formatDateToInputValue(new Date(scheduleField.value))
                                    : ""
                                }
                                className="w-full sm:w-auto"
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  scheduleField.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-4">
            <label htmlFor="schedule" className="block w-32">
              Min. Tip
            </label>
            <FormField
              control={form.control}
              name="settings.minTip"
              render={({ field: minTip }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...minTip}
                      type="number"
                      placeholder="1000 DHB"
                      min={1000}
                      className="w-full sm:w-auto"
                      onChange={(e) => minTip.onChange(Number(e.target.value))} // Convert value to number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*
          Change to a stream delay
          <div className="flex items-center space-x-4">
            <label htmlFor="schedule">Tip Delay</label>
            <FormField
              control={form.control}
              name="settings.tipDelay"
              render={({ field: tipDelay }) => (
                <FormItem>
                  <FormControl>
                    <Select value={tipDelay?.value} onValueChange={tipDelay.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select delay" />
                      </SelectTrigger>
                      <SelectContent>
                        {delayOptions.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </div>

        <div className="flex w-full flex-col gap-8 rounded-2xl border border-gray-300/25 px-4 py-6 sm:p-10">
          {/* Lock Content Section */}
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="lockContent" className="block w-32">
                Lock Content
              </label>
              {/* <span className="text-lg">Lock Content</span> */}
              <FormField
                name="lockContent"
                control={form.control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Lock content behind token holdings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isLockedContent && (
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="lockToken"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!isLockedContent}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTokens("lock").map((token) => (
                          <SelectItem key={token.value} value={token.value}>
                            <div className="flex items-center gap-2">
                              <img src={token.iconUrl} alt={token.label} className="h-4 w-4" />
                              {token.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormField
                  name="lockNetwork"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!isLockedContent}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="Network" />
                      </SelectTrigger>
                      <SelectContent>
                        {getNetworks(selectedLockToken, "lock").map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            {network.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...form.register("lockAmount")}
                  disabled={!isLockedContent}
                  placeholder="Amount"
                  className="w-32"
                />
              </div>
            )}
          </div>

          {/* Pay Per View Section */}
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-4">
              {/* <span className="text-lg">Pay Per View</span> */}
              <label htmlFor="payPerView" className="block w-32">
                Pay Per View
              </label>

              <FormField
                name="payPerView"
                control={form.control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Charge viewers for access</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isPayPerView && (
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="ppvToken"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!isPayPerView}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTokens("ppv").map((token) => (
                          <SelectItem key={token.value} value={token.value}>
                            <div className="flex items-center gap-2">
                              <img src={token.iconUrl} alt={token.label} className="h-4 w-4" />
                              {token.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormField
                  name="ppvNetwork"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!isPayPerView}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="Network" />
                      </SelectTrigger>
                      <SelectContent>
                        {getNetworks(selectedPPVToken, "ppv").map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            {network.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...form.register("ppvAmount")}
                  disabled={!isPayPerView}
                  placeholder="Amount"
                  className="w-32"
                />
              </div>
            )}
          </div>

          {/* Bounty Section */}
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="bounty" className="block w-32">
                Bounty
              </label>
              {/* <span className="text-lg">Bounty</span> */}
              <FormField
                name="bounty"
                control={form.control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Add rewards for engagement</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isBounty && (
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <FormField
                  name="bountyToken"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!isBounty}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 w-full sm:w-32">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTokens("bounty").map((token) => (
                          <SelectItem key={token.value} value={token.value}>
                            <div className="flex items-center gap-2">
                              <img src={token.iconUrl} alt={token.label} className="h-4 w-4" />
                              {token.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...form.register("bountyFirstViewers")}
                  disabled={!isBounty}
                  placeholder="First X Viewers"
                  className="w-full sm:w-36"
                />
                <Input
                  {...form.register("bountyFirstComments")}
                  disabled={!isBounty}
                  placeholder="First X Comments"
                  className="w-full sm:w-36"
                />
                <Input
                  {...form.register("bountyAmount")}
                  disabled={!isBounty}
                  placeholder="Amount"
                  className="w-full sm:w-32"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          disabled={isloading}
          onClick={form.handleSubmit(createStream)}
          variant="gradientOne"
          className="relative h-auto w-full overflow-hidden py-4 text-2xl sm:text-4xl"
        >
          {isloading ? "Creating" : "Create Broadcast"}
        </Button>
      </Form>
    </main>
  );
}
