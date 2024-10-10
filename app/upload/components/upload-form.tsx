  "use client";

  import { useEffect, useMemo, useState } from "react";
  import { useRouter } from "next/navigation";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
  import { ethers } from "ethers";
  import { ImagePlus, Info, Upload } from "lucide-react";
  import { useDropzone } from "react-dropzone";
  import { Controller, useForm } from "react-hook-form";
  import { toast } from "sonner";
  import { z } from "zod";

  import { CreatableTagInput } from "@/components/form/tag-input";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog";
  import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from "@/components/ui/select";
  import { Spinner } from "@/components/ui/spinner";
  import { Switch } from "@/components/ui/switch";
  import { Textarea } from "@/components/ui/textarea";
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

  import useTokenBalance from "@/hooks/use-token-balance";
  import { useUser } from "@/hooks/use-user";
  import {
    useContract,
    useERC20Contract,
    useStreamCollectionContract,
    useStreamControllerContract
  } from "@/hooks/use-web3";

  import { getVideoCover } from "@/libs/canvas-preview";
  import { cn, createAvatarName } from "@/libs/utils";

  import { minNft } from "@/services/nfts/mint";

  import MULTICALL_ABI from "@/web3/abis/multicall.json";
  import { STREAM_CONTROLLER_CONTRACT_ADDRESSES, supportedNetworks } from "@/web3/configs";
  import { getTotalBountyAmount } from "@/web3/utils/calc";
  import { filteredStreamInfo } from "@/web3/utils/format";
  import { multicallRead } from "@/web3/utils/multicall";
  import { getDistinctTokens, getNetworksForToken } from "@/web3/utils/tokens";
  import { approveToken, mintWithBounty } from "@/web3/utils/transaction";
  import { isValidDataForMinting } from "@/web3/utils/validators";
  import { getSignInfo } from "@/web3/utils/web3-actions";

  import {
    MULTICALL2_ADDRESSES,
    streamInfoKeys,
    supportedTokens,
    supportedTokensForLockContent,
    supportedTokensForPPV
  } from "@/configs";

  import { invalidateUpload } from "../action";

  /* ----------------------------------------------------------------------------------------------- */

  const schema = z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, { message: "Title is too short" }),
    description: z
      .string({ required_error: "Description is required" })
      .min(3, { message: "Description is too short" }),
    category: z.array(z.string()).min(1, { message: "Category is required" }),
    thumbnail: z.string({ required_error: "Thumbnail is required" }),
    video: z.string({ required_error: "Video is required" }),
    lockContent: z.boolean().optional().default(false),
    token: z.string().optional(),
    network: z.string().optional(),
    lockContentAmount: z.string().optional(),
    payPerView: z.boolean().optional().default(false),
    chain: z.string().optional(),
    payPerViewNetwork: z.string().optional(),
    ppvAmount: z.string().optional(),
    bounty: z.boolean().optional().default(false),
    bountyChain: z.string().optional(),
    bountyFirstXViewer: z.string().optional(),
    bountyFirstXComment: z.string().optional(),
    bountyAmount: z.string().optional(),
    streamInfo: z.record(z.any()).optional()
  });

  type Form = z.infer<typeof schema>;
  type Props = { categories: string[] };

  export const isUserCanAddNewCategory = (badge?: { name: string }) => badge && badge.name !== "Crab";

  export function UploadForm(props: Props) {
    const { categories } = props;
    const { account, chainId, library, user } = useUser();

    const [uploading, setUploading] = useState(false);

    const [modalDescription, setModalDescription] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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

    const form = useForm<Form>({
      resolver: zodResolver(schema)
    });

    const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
      accept: { "video/*": [".mp4"] },
      maxSize: 1_000_000_000,
      onDrop(acceptedFiles) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        getVideoCover(file).then((cover) => {
          if (cover && !thumbnailFile && !thumbnailPreview) {
            const imgUrl = URL.createObjectURL(cover);
            form.setValue("thumbnail", imgUrl);
            setThumbnailPreview(imgUrl);
            setThumbnailFile(cover as File);
          }
        });
        setVideoPreview(url);
        setVideoFile(file);
        form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
        form.setValue("video", url);
      }
    });

    const {
      getRootProps: getThumbnailRootProps,
      getInputProps: getThumbnailInputProps,
      isDragAccept: isThumbnailAccept,
      isDragReject: isThumbnailReject
    } = useDropzone({
      accept: { "image/*": [".jpg", ".jpeg", ".png"] },
      maxSize: 20_971_520, // 20MB
      onDrop(acceptedFiles) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setThumbnailPreview(url);
        setThumbnailFile(file);
        form.setValue("thumbnail", url);
      }
    });

    const supportedTokensForChain = useMemo(
      () => supportedTokens.filter((e) => e.chainId === chainId),
      [chainId]
    );

    const isLockedContent = form.watch("lockContent");
    const selectedToken = form.watch("token");
    const network = form.watch("network");
    const amount = form.watch("lockContentAmount");

    const tokens = getDistinctTokens(supportedTokensForLockContent, undefined);
    const token = tokens.find((t) => t.value === selectedToken);
    const networksForAToken = token
      ? getNetworksForToken(token.symbol, supportedTokensForLockContent)
      : supportedNetworks;

    const isPayPerView = form.watch("payPerView");
    const selectedPPVToken = form.watch("chain");
    const ppvAmount = form.watch("ppvAmount");
    const ppvNetwork = form.watch("payPerViewNetwork");
    const payPerViewTokens = getDistinctTokens(supportedTokensForPPV, undefined);
    const networkForPPVToken = payPerViewTokens.find((t) => t.value === selectedPPVToken);
    const networksForPPVToken = networkForPPVToken
      ? getNetworksForToken(networkForPPVToken.symbol, supportedTokensForPPV)
      : supportedNetworks;

    const isBounty = form.watch("bounty");
    const firstXViewer = form.watch("bountyFirstXViewer");
    const firstXComment = form.watch("bountyFirstXComment");
    const bountyAmount = form.watch("bountyAmount");
    const selectedBountyChain = form.watch("bountyChain");
    const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
    const bountyTokenContract = useERC20Contract(selectedTokenAddress);

    const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);

    const [showModal, setShowModal] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    // Update bounty Token address
    useEffect(() => {
      const chain = supportedTokensForChain.find((t) => t.value === selectedBountyChain);
      if (chain) {
        setSelectedTokenAddress(chain.address);
      }
    }, [selectedBountyChain, supportedTokensForChain]);

    // update isApproved
    useEffect(() => {
      const updateIsapproved = async () => {
        const callDataArray = [];
        callDataArray.push({
          contract: bountyTokenContract,
          functionName: "balanceOf",
          param: [account],
          returnKey: `wallet`
        });
        callDataArray.push({
          contract: bountyTokenContract,
          functionName: "allowance",
          param: [account, streamControllerContractAddress],
          returnKey: `allowance`
        });
        const bountyToken = supportedTokensForChain.find((t) => t.value === selectedBountyChain);
        // @ts-expect-error Fix types later
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const multicallResult: any = await multicallRead(multicallContract, callDataArray);
        if (
          multicallResult &&
          bountyAmount &&
          multicallResult.allowance &&
          Number(bountyAmount) <
            Number(ethers.utils.formatUnits(multicallResult.allowance, bountyToken?.decimals))
        ) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      };
      updateIsapproved();
    }, [
      account,
      bountyAmount,
      bountyTokenContract,
      multicallContract,
      selectedBountyChain,
      streamControllerContractAddress,
      supportedTokensForChain
    ]);

    // Lock content
    useEffect(() => {
      const streamInfo = form.getValues("streamInfo");
      const lockContent = { [streamInfoKeys.isLockContent]: isLockedContent };
      const lockContentToken = { [streamInfoKeys.lockContentTokenSymbol]: token?.symbol || "" };

      const lockContentChainIds = {
        [streamInfoKeys.lockContentChainIds]:
          networksForAToken.find((t) => t.value === network)?.chainId || ""
      };
      const lockContentAmount = { [streamInfoKeys.lockContentAmount]: amount || 0 };
      form.setValue("streamInfo", {
        ...streamInfo,
        ...lockContent,
        ...lockContentToken,
        ...lockContentChainIds,
        ...lockContentAmount
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLockedContent, token?.symbol, network, amount, networksForAToken]);

    // Pay per view
    useEffect(() => {
      const streamInfo = form.getValues("streamInfo");
      const payPerView = { [streamInfoKeys.isPayPerView]: isPayPerView };
      const payPerViewToken = {
        [streamInfoKeys.payPerViewTokenSymbol]: networkForPPVToken?.symbol || ""
      };
      const payPerViewChainIds = {
        [streamInfoKeys.payPerViewChainIds]:
          networksForPPVToken.find((t) => t.value === ppvNetwork)?.chainId || ""
      };
      const payPerViewAmount = { [streamInfoKeys.payPerViewAmount]: ppvAmount || 0 };
      form.setValue("streamInfo", {
        ...streamInfo,
        ...payPerView,
        ...payPerViewToken,
        ...payPerViewChainIds,
        ...payPerViewAmount
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, isPayPerView, network, networkForPPVToken?.symbol, networksForPPVToken]);

    // Bounty
    useEffect(() => {
      const streamInfo = form.getValues("streamInfo");
      const bounty = { [streamInfoKeys.isAddBounty]: isBounty };
      const chain = supportedTokensForChain.find((t) => t.value === selectedBountyChain);
      const bountyToken = { [streamInfoKeys.addBountyTokenSymbol]: chain?.symbol || "" };
      const bountyChainIds = {
        [streamInfoKeys.addBountyChainId]: chainId
      };
      const bountyFirstXViewer = { [streamInfoKeys.addBountyFirstXViewers]: firstXViewer || 0 };
      const bountyFirstXComment = { [streamInfoKeys.addBountyFirstXComments]: firstXComment || 0 };
      const amount = { [streamInfoKeys.addBountyAmount]: bountyAmount || 0 };
      form.setValue("streamInfo", {
        ...streamInfo,
        ...bounty,
        ...bountyToken,
        ...bountyChainIds,
        ...bountyFirstXViewer,
        ...bountyFirstXComment,
        ...amount
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bountyAmount, chainId, firstXComment, firstXViewer, isBounty, supportedTokensForChain]);

    const onApproveClick = async () => {
      setUploading(true);
      const txHash = await approveToken(
        bountyTokenContract,
        library,
        streamControllerContractAddress
      );
      if (txHash) {
        addTransaction({ hash: txHash as string, description: "Approve", confirmations: 3 });
        setIsApproved(true);
      }
      setUploading(false);
    };


    const handleMint = async (data: Form) => {
      if (uploading) return;
    
      setUploading(true);
    
      async function _upload() {
        if (!account) {
          toast.error("Please connect your wallet");
          return;
        }
    
        try {
          const sigData = await getSignInfo(library, account);
    
          const formData = new FormData();
          formData.append("name", data.title);
          formData.append("description", data.description);
          data.streamInfo &&
            formData.append("streamInfo", JSON.stringify(filteredStreamInfo(data.streamInfo)));
          videoFile && formData.append("files", videoFile);
          thumbnailFile && formData.append("files", thumbnailFile);
          formData.append(
            "category",
            data.category?.length > 0 ? JSON.stringify(data.category.map((e) => e)) : ""
          );
          formData.append("address", account.toLowerCase());
          formData.append("sig", sigData.sig);
          formData.append("chainId", chainId.toString());
          formData.append("timestamp", sigData.timestamp);
    
          const res = await minNft(formData);
          if (!res.success) {
            setUploading(false);
            throw new Error(res.error);
          }
    
          const result = res.data;
          
          if (result.error) {
            setUploading(false);
            throw new Error(result.msg || "NFT mint has failed!");
          }
    
          const tokenId = result.createdTokenId; // Extract the tokenId from the response
    
          // Start listening for server-sent events (SSE) for transcoding progress
          const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transcode-progress/${tokenId}`);
    
          eventSource.onmessage = (event) => {
            const progressData = JSON.parse(event.data);
            if (progressData.progress) {
              toast.message(`Transcoding: ${Math.round(progressData.progress)}%`, {
                duration: 1000,
              });
            }
            if (progressData.status === 'completed') {
              toast.success('Transcoding completed');
              eventSource.close();
            } else if (progressData.status === 'failed') {
              toast.error('Transcoding failed');
              eventSource.close();
            }
          };
    
          if (data.streamInfo?.[streamInfoKeys.isAddBounty]) {
            try {
              const tokenSymbol = data?.streamInfo[streamInfoKeys.addBountyTokenSymbol] || "BJ";
              const bountyToken = supportedTokens.find(
                (e) => e.symbol === tokenSymbol && e.chainId === chainId
              );
    
              const tx = await mintWithBounty(
                streamController,
                tokenId,
                result.timestamp,
                result.v,
                result.r,
                result.s,
                bountyToken,
                bountyAmount,
                firstXViewer,
                firstXComment
              );
              if (tx?.hash) {
                addTransaction({ hash: tx.hash, description: "Mint With Bounty", confirmations: 3 });
              }
              await tx.wait(1);
    
              form.reset();
    
              await invalidateUpload();
              setUploading(false);
              return;
            } catch (err) {
              setUploading(false);
              throw new Error("NFT mint has failed!");
            }
          }
    
          if (streamCollectionContract) {
            const tx = await streamCollectionContract.mint(
              tokenId,
              result.timestamp,
              result.v,
              result.r,
              result.s,
              [],
              1000,
              `${tokenId}.json`
            );
    
            if (tx?.hash) {
              addTransaction({ hash: tx.hash, description: "Mint NFT", confirmations: 3 });
            }
    
            await tx.wait(1);
            form.reset();
          }
    
          await invalidateUpload();
          router.push(`/stream/${tokenId}`);
        } catch (err) {
          console.log(err);
          if (err instanceof Error) {
            if (err.message.includes("user rejected transaction")) {
              setUploading(false);
              throw new Error("User rejected transaction");
            }
    
            setUploading(false);
            throw new Error(err.message);
          }
    
          setUploading(false);
          throw new Error("Upload failed");
        }
      }
    
      toast.promise(_upload(), {
        loading: "Uploading...",
        success: () => "Upload confirmed",
        error: (err) => err.message,
      });
    };
    

    const handleOnUploadAndMint = async (data: Form) => {
      if (!account) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!user) {
        toast.error("Please connect your wallet");
        return;
      }

      const isValid = isValidDataForMinting(
        data.title,
        data.description,
        data.streamInfo || {},
        user.result,
        tokenBalances.tokenBalances
      );

      if (isValid.isError) {
        toast.error(isValid.error);
        return;
      }

      if (isBounty) {
        const addBountyTotalAmount = getTotalBountyAmount(data.streamInfo, true);
        if (data.streamInfo) {
          const description = `Are you sure you want to spend ${addBountyTotalAmount} ${
            data.streamInfo[streamInfoKeys.addBountyTokenSymbol]
          } on this Bounty Upload?`;
          setModalDescription(description);
          setShowConfirmationModal(true);
        }
        return;
      }

      const description = `Are you sure the details are correct and you wish to proceed? NFT uploads can't be edited and it's on chain forever`;
      setModalDescription(description);
      setShowConfirmationModal(true);
    };

    return (
      <main className="h-auto min-h-screen w-full">
        <Form {...form}>
          <div className="flex h-auto w-full flex-col items-start justify-start gap-10 px-4 py-28">
            <div className="flex h-auto w-full flex-wrap items-stretch justify-between gap-10 lg:gap-0">
              <div className="h-auto w-full max-w-full flex-[0_0_100%] space-y-6 rounded-2xl p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
                <h1 className="text-3xl">Video info</h1>
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Video Title"
                          className="h-12 rounded-full px-8 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="h-28 resize-none rounded-3xl px-8 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex h-auto w-full flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-start">
                  <p className="min-w-[20%] text-lg">Category</p>

                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex h-auto w-full items-center justify-start gap-2">
                  <p className="min-w-[20%] text-lg leading-none">
                    Cover <br /> Image
                  </p>

                  <div className="h-auto w-full">
                    <div
                      className={cn(
                        "relative h-40 max-h-40 w-full overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-theme-mine-shaft-dark hover:cursor-pointer dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
                        isThumbnailAccept ? "border border-green-500" : "",
                        isThumbnailReject ? "border border-red-500" : ""
                      )}
                      {...getThumbnailRootProps()}
                    >
                      {!thumbnailPreview && (
                        <>
                          <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2">
                            <ImagePlus className="size-10 text-gray-300 dark:text-theme-titan-white/60" />
                            <div className="flex size-auto flex-col items-center justify-center -space-y-1">
                              <p className="text-md">No File Chosen</p>
                              <p className="text-sm">(Recommended size: 1280x720)</p>
                            </div>
                          </div>

                          <input
                            type="file"
                            className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                            {...getThumbnailInputProps()}
                          />
                        </>
                      )}

                      {thumbnailPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="size-full rounded-3xl object-cover"
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  {thumbnailFile && (
                    <Button
                      variant="gradientOne"
                      size="sm"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setThumbnailFile(null);
                        form.setValue("thumbnail", "");
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex h-auto w-full max-w-full flex-[0_0_100%] flex-col items-start justify-start gap-6 rounded-2xl p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
                <div className="flex w-full items-center justify-between">
                  <h1 className="text-3xl">UPLOAD PREVIEW</h1>
                  {videoFile && (
                    <Button
                      size="sm"
                      variant="gradientOne"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                        form.setValue("video", "");
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div
                  {...getRootProps()}
                  className={cn(
                    "relative h-60 w-full rounded-3xl border border-dashed border-gray-200 bg-theme-mine-shaft-dark hover:cursor-pointer dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark lg:size-full",
                    isDragAccept ? "border border-green-500" : "",
                    isDragReject ? "border border-red-500" : ""
                  )}
                >
                  {!videoPreview && (
                    <>
                      <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2">
                        <Upload className="size-12 text-gray-300 dark:text-theme-titan-white/60" />
                        <div className="flex size-auto flex-col items-center justify-center">
                          <p className="text-md">Drop or Select Video</p>
                          <p className="text-sm">(Max Video File Size: 1GB)</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                        {...getInputProps()}
                      />
                    </>
                  )}

                  {videoPreview && (
                    <video
                      className="size-full rounded-3xl object-cover"
                      src={videoPreview}
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-auto w-full flex-col items-start justify-start gap-8 rounded-2xl p-5 sm:p-10">
              <div className="relative flex h-auto w-full items-start justify-start 2xl:items-center">
                <p className="min-w-[150px] text-lg lg:min-w-[15%]">Lock Content</p>
                <div className="flex size-auto flex-wrap items-center justify-start gap-6">
                  <Controller
                    name="lockContent"
                    control={form.control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />

                  <Controller
                    name="token"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={!isLockedContent}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-[150px] rounded-full border-2 bg-transparent px-4 text-sm">
                          <SelectValue placeholder="Token" />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.label} value={token.value}>
                              <div className="flex items-center justify-center gap-2">
                                <Avatar className="size-8">
                                  <AvatarFallback>{createAvatarName(token.label)}</AvatarFallback>
                                  <AvatarImage src={token.iconUrl} alt={token.label} />
                                </Avatar>
                                {token.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="network"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={!isLockedContent}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-[150px] rounded-full border-2 bg-transparent px-4 text-sm">
                          <SelectValue placeholder="Network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networksForAToken.length === 0 && <p>No networks available</p>}
                          {networksForAToken.map((token) => (
                            <SelectItem key={token.label} value={token.value}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Input
                    disabled={!isLockedContent}
                    type="text"
                    placeholder="Amount"
                    className="h-10 w-[110px] rounded-full border-none px-5 text-sm"
                    {...form.register("lockContentAmount")}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="absolute right-0 top-0 z-10 sm:relative"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Make your upload exclusive for token holders, for amount, simply add the total
                        amount of token holdings required to view your post!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative flex h-auto w-full items-start justify-start 2xl:items-center">
                <p className="min-w-[150px] text-lg font-semibold lg:min-w-[15%]">Pay Per View</p>
                <div className="flex size-auto flex-wrap items-center justify-start gap-6">
                  <Controller
                    name="payPerView"
                    control={form.control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />

                  <Controller
                    name="chain"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={!isPayPerView}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-[150px] rounded-full border-2 bg-transparent px-4 text-sm">
                          <SelectValue placeholder="Token" />
                        </SelectTrigger>
                        <SelectContent>
                          {payPerViewTokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.value}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="payPerViewNetwork"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={!isPayPerView}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 w-[150px] rounded-full border-2 bg-transparent px-4 text-sm">
                          <SelectValue placeholder="Network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networksForPPVToken.map((token) => (
                            <SelectItem key={token.id} value={token.value}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Input
                    disabled={!isPayPerView}
                    type="text"
                    placeholder="Amount"
                    className="h-10 w-[110px] rounded-full border-none px-5 text-sm"
                    {...form.register("ppvAmount")}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="absolute right-0 top-0 hover:bg-transparent sm:relative"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Charge a one time pay-per-view fee for accessing your upload or live stream.
                        For amount, enter the one time fee you wish to charge each individual viewer.
                        Only a 10% fee is charged on each transaction
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative flex h-auto w-full items-start justify-start 2xl:items-center">
                <p className="min-w-[150px] text-lg font-semibold lg:min-w-[15%]">Watch2Earn</p>
                <div className="flex size-auto flex-wrap items-center justify-start gap-6">
                  <Controller
                    name="bounty"
                    control={form.control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />

                  <Controller
                    name="bountyChain"
                    control={form.control}
                    render={({ field }) => (
                      <Select disabled={!isBounty} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-10 w-[150px] rounded-full border-2 bg-transparent px-4 text-sm">
                          <SelectValue placeholder="Token" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedTokensForChain.map((token) => (
                            <SelectItem key={token.chainId} value={token.value}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Button disabled className="rounded-full">
                    {supportedNetworks.find((e) => e.chainId === chainId)?.value}
                  </Button>

                  <Input
                    disabled={!isBounty}
                    type="text"
                    placeholder="First X Viewer"
                    className="h-10 w-[150px] rounded-full border-none px-5 text-sm"
                    {...form.register("bountyFirstXViewer")}
                  />
                  <Input
                    disabled={!isBounty}
                    type="text"
                    placeholder="First X Comments"
                    className="h-10 w-[175px] rounded-full border-none px-5 text-sm"
                    {...form.register("bountyFirstXComment")}
                  />
                  <Input
                    disabled={!isBounty}
                    type="text"
                    placeholder="Amount"
                    className="h-10 w-[110px] rounded-full border-none px-5 text-sm"
                    {...form.register("bountyAmount")}
                  />
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="absolute right-0 top-0 hover:bg-transparent sm:relative"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Strap a bounty to your upload and make it watch2earn to reward your fans and
                        build a community, fast. In the first two boxes, enter the number of viewers
                        and commentor you wish to reward. The amount box is the amount each comment or
                        view will earn. Only a 10% fee is charged for this service.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                className="h-auto w-full rounded-md py-4 text-2xl sm:text-4xl"
                size="lg"
                variant="gradientOne"
                disabled={uploading}
                onClick={form.handleSubmit(handleOnUploadAndMint)}
              >
                {!uploading && "Upload Post / Mint NFT"}
                {uploading && (
                  <>
                    Uploading...
                    <Spinner className="ml-1 size-10" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>

        <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild className="mr-3">
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  setShowConfirmationModal(false);
                  if (isBounty) {
                    setShowModal(true);
                  } else {
                    handleMint(form.getValues());
                  }
                }}
                variant="gradientOne"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bounty upload modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bounty details</DialogTitle>
              <DialogDescription>Approve and confirm your Bounty Mint</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild className="mr-3">
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                disabled={isApproved || uploading}
                onClick={onApproveClick}
                variant="gradientOne"
              >
                Approve
              </Button>
              <Button
                disabled={!isApproved || uploading}
                onClick={() => {
                  setShowModal(false);
                  handleMint(form.getValues());
                }}
                variant="gradientOne"
              >
                Pay Bounty And Mint
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    );
  }
