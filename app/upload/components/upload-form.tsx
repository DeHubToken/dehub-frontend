"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { th } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { BigNumber, ethers } from "ethers";
import { ImagePlus, Info, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
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
import { getPlans } from "@/services/subscription-plans";

import MULTICALL_ABI from "@/web3/abis/multicall.json";
import { STREAM_CONTROLLER_CONTRACT_ADDRESSES, supportedNetworks } from "@/web3/configs";
import { getTotalBountyAmount } from "@/web3/utils/calc";
import { filteredStreamInfo } from "@/web3/utils/format";
import { getIpfsHashFromFile } from "@/web3/utils/ipfs";
import { multicallRead } from "@/web3/utils/multicall";
import { getDistinctTokens, getNetworksForToken } from "@/web3/utils/tokens";
import {
  approveToken,
  calculateGasMargin,
  GAS_MARGIN,
  mintWithBounty
} from "@/web3/utils/transaction";
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
import ImageCover from "./ImageCover";
import ImageUploadTab from "./ImageUploadTab";
import Tabs from "./Tabs";
import VideoUploadTab from "./VideoUploadTab";

interface PreviewFile extends File {
  preview?: string;
}

/* ----------------------------------------------------------------------------------------------- */

const schema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title is too short" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, { message: "Description is too short" }),
  category: z.array(z.string()).min(1, { message: "Category is required" }),
  // thumbnail: z.string({ required_error: "Thumbnail is required" }),
  // video: z.string({ required_error: "Video is required" }),
  lockContent: z.boolean().optional().default(false),
  token: z.string().optional(),
  network: z.string().optional(),
  lockContentAmount: z.string().optional(),
  payPerView: z.boolean().optional().default(false),
  chain: z.string().optional(),
  payPerViewNetwork: z.string().optional(),
  isRequireSubscription: z.boolean().optional().default(false),
  ppvAmount: z.string().optional(),
  bounty: z.boolean().optional().default(false),
  bountyChain: z.string().optional(),
  bountyFirstXViewer: z.string().optional(),
  bountyFirstXComment: z.string().optional(),
  bountyAmount: z.string().optional(),
  streamInfo: z.record(z.any()).optional(),
  plans: z.any().optional()
});

type Form = z.infer<typeof schema>;
type Props = { categories: string[] };

export const isUserCanAddNewCategory = (badge?: { name: string }) => badge && badge.name !== "Crab";

export function UploadForm(props: Props) {
  const { categories } = props;
  const [showModal, setShowModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<PreviewFile[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modalDescription, setModalDescription] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [plans, setPlans] = useState([]);
  const transformedPlans = plans
    .map((plan: any) => ({
      value: plan.id,
      label: <span className="text-gray-500">Tier {plan.tier}</span>,
      tier: plan.tier // Include tier for sorting purposes
    }))
    .sort((a, b) => a.tier - b.tier);
  const streamCollectionContract = useStreamCollectionContract();
  const streamController = useStreamControllerContract();
  const addTransaction = useAddRecentTransaction();
  const tokenBalances = useTokenBalance(false);
  const { account, chainId, library, user } = useUser();

  const streamControllerContractAddress = useMemo(
    // @ts-expect-error no index with type number on STREAM_CONTROLLER_CONTRACT_ADDRESSES
    () => STREAM_CONTROLLER_CONTRACT_ADDRESSES[chainId],
    [chainId]
  );

  const router = useRouter();

  const form = useForm<Form>({
    resolver: zodResolver(schema)
  });

  const supportedTokensForChain = useMemo(
    () => supportedTokens.filter((e) => e.chainId === chainId),
    [chainId]
  );
  const isLockedContent = form.watch("lockContent");
  const selectedToken = form.watch("token");
  const network = form.watch("network");
  const amount = form.watch("lockContentAmount");
  // console.log("formPlans", form.watch("plans"));
  const tokens = getDistinctTokens(supportedTokensForLockContent, chainId);
  const token = tokens.find((t: any) => t.value === selectedToken);
  const networksForAToken = token
    ? getNetworksForToken(token.symbol, supportedTokensForLockContent)
    : supportedNetworks;
  const isPayPerView = form.watch("payPerView");
  const selectedPPVToken = form.watch("chain");
  const isRequireSubscription = form.watch("isRequireSubscription");
  const ppvAmount = form.watch("ppvAmount");
  const ppvNetwork = form.watch("payPerViewNetwork");
  const payPerViewTokens = getDistinctTokens(supportedTokensForPPV, chainId);
  const networkForPPVToken = payPerViewTokens.find((t: any) => t.value === selectedPPVToken);
  const networksForPPVToken = networkForPPVToken
    ? getNetworksForToken(networkForPPVToken.symbol, supportedTokensForPPV)
    : supportedNetworks;
  const isBounty = form.watch("bounty");
  const firstXViewer = form.watch("bountyFirstXViewer");
  const firstXComment = form.watch("bountyFirstXComment");
  const bountyAmount = form.watch("bountyAmount");
  const selectedBountyChain = form.watch("bountyChain");
  const bountyTokenContract = useERC20Contract(selectedTokenAddress);
  const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);
  const { theme } = useTheme();
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
        if (activeTab === "Feed" && imagePreviews.length > 0) {
          formData.append("postType", "feed-images");
          imagePreviews.map((feedImage: PreviewFile) => {
            feedImage && formData.append("feed-images", feedImage);
          });
        } else if (activeTab === "Feed") {
          formData.append("postType", "feed-simple");
        }
        if (activeTab == "video") {
          formData.append("postType", "video");
          videoFile && formData.append("files", videoFile);
          thumbnailFile && formData.append("files", thumbnailFile);
        }

        data.streamInfo &&
          formData.append("streamInfo", JSON.stringify(filteredStreamInfo(data.streamInfo)));
        formData.append(
          "category",
          data.category?.length > 0 ? JSON.stringify(data.category.map((e) => e)) : ""
        );
        formData.append("address", account.toLowerCase());
        formData.append("sig", sigData.sig);
        formData.append("chainId", chainId.toString());
        formData.append("timestamp", sigData.timestamp);
        if (data.isRequireSubscription) {
          formData.append("plans", JSON.stringify(data.plans));
        }
        const res = await minNft(formData);
        if (!res.success) {
          setUploading(false);
          throw new Error(res.error);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = res.data;
        if (result?.error) {
          setUploading(false);
          throw new Error(result?.error_msg || "NFT mint has failed!");
        } 
        if (data.streamInfo?.[streamInfoKeys?.isAddBounty]) {
          try {
            const tokenSymbol = data?.streamInfo[streamInfoKeys.addBountyTokenSymbol] || "BJ";
            const bountyToken = supportedTokens.find(
              (e) => e.symbol === tokenSymbol && e.chainId === chainId
            );

            // Call mint with bountry
            const tx = await mintWithBounty(
              // library,
              streamController,
              result.createdTokenId,
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
            // if (!resultFromModal) {
            //   setUploading(false);
            //   throw new Error("NFT mint has failed!");
            // } 
            await invalidateUpload();
            setUploading(false);
            return;
          } catch (err) {
            throw new Error("NFT mint has failed!");
          }
        } 
        if (streamCollectionContract) {
          const estimatedGasPrice = await library.getGasPrice(); 
          const adjustedGasPrice = estimatedGasPrice
            .mul(BigNumber.from(110))
            .div(BigNumber.from(100)); 
          // Estimate gas limit
          const estimatedGasLimit = await streamCollectionContract.estimateGas.mint(
            result.createdTokenId,
            result.timestamp,
            result.v,
            result.r,
            result.s,
            [],
            1000,
            `${result.createdTokenId}.json`
          ); 
          const tx = await streamCollectionContract.mint(
            result.createdTokenId,
            result.timestamp,
            result.v,
            result.r,
            result.s,
            [],
            1000,
            `${result.createdTokenId}.json`, 
            {
              gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
              gasPrice: adjustedGasPrice
            }
          );
          console.log("here though 2", tx);
          if (tx?.hash) {
            addTransaction({ hash: tx.hash, description: "Mint NFT", confirmations: 3 });
          }
          await tx.wait(1);
          form.reset();
        }
        await invalidateUpload();
        if (activeTab == "video") {
          router.push(`/stream/${result.createdTokenId}`);
        } else {
          router.push(`/?type=feeds/${result.createdTokenId}`);
        }
      } catch (err: any) {
        console.log("err-mint:", err);
        if (err instanceof Error) {
          if (err.message.includes("user rejected transaction")) {
            setUploading(false);
            throw new Error("User rejected transaction");
          }

          setUploading(false);
          throw new Error(err.message);
        }
        setUploading(false);
        throw new Error(err.message);
      }
    }
    toast.promise(_upload(), {
      loading: "Uploading...",
      success: () => "Upload confirmed",
      error: (err) => err.message
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

    if (activeTab == "video") {
      if (!videoFile) {
        toast.error("please select a video!");
        return;
      }
      if (!thumbnailFile) {
        toast.error("please select a thumbnail image!");
        return;
      }
    }
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
  const fetchPlans = async () => {
    const obj = {
      address: account?.toLowerCase()
    };
    const { data, success, error }: any = await getPlans(obj);
    if (success) {
      const { plans }: any = data;
      setPlans(plans);
    }
    if (error) {
      toast.error(error);
    }
  }; 
  useEffect(() => {
    fetchPlans();
  }, [account, chainId]);
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
      [streamInfoKeys.lockContentChainIds]: [
        networksForAToken.find((t) => t.value === network)?.chainId || ""
      ]
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
      [streamInfoKeys.payPerViewChainIds]: [
        networksForPPVToken.find((t) => t.value === ppvNetwork)?.chainId || ""
      ]
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

  useEffect(() => {
    fetchPlans();
  }, [account, chainId]);
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
      [streamInfoKeys.lockContentChainIds]: [
        networksForAToken.find((t) => t.value === network)?.chainId || ""
      ]
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
      [streamInfoKeys.payPerViewChainIds]: [
        networksForPPVToken.find((t) => t.value === ppvNetwork)?.chainId || ""
      ]
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

  return (
    <main className="h-auto min-h-screen w-full">
      <Form {...form}>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-6 px-4 py-28 sm:gap-10">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex h-auto w-full flex-wrap items-stretch justify-between gap-6 lg:gap-0">
            <div className="h-auto w-full max-w-full flex-[0_0_100%] space-y-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
              <h1 className="text-3xl">{activeTab == "video" ? "Video" : "Feed"} info</h1>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={`${activeTab === "video" ? "video" : "Feed"} title`}
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
                          options={categories.map((category, key) => ({
                            key,
                            label: category,
                            value: category
                          }))}
                          value={field.value?.map((category, key) => ({
                            key,
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
              {activeTab === "video" && (
                <ImageCover
                  form={form}
                  thumbnailFile={thumbnailFile}
                  setThumbnailFile={setThumbnailFile}
                  setThumbnailPreview={setThumbnailPreview}
                  thumbnailPreview={thumbnailPreview}
                />
              )}
            </div>

            {/*tab layout start*/}
            <div className="flex h-auto w-full max-w-full flex-[0_0_100%] flex-col items-start justify-start gap-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
              {activeTab === "video" && (
                <VideoUploadTab
                  videoFile={videoFile}
                  setVideoPreview={setVideoPreview}
                  setVideoFile={setVideoFile}
                  form={form}
                  videoPreview={videoPreview}
                  setThumbnailPreview={setThumbnailPreview}
                  setThumbnailFile={setThumbnailFile}
                  thumbnailFile={thumbnailFile}
                  thumbnailPreview={thumbnailPreview}
                />
              )}
              {activeTab === "Feed" && (
                <ImageUploadTab imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} />
              )}
            </div>
            {/*tab layout end*/}
          </div>

          <div className="flex h-auto w-full flex-col items-start justify-start gap-8 rounded-2xl border border-gray-300/25 px-4 pb-6 pt-10 sm:gap-8 sm:p-10">
            <div className="relative flex size-auto flex-wrap items-start justify-start border-b-2 border-gray-300/5 pb-8 sm:flex-nowrap sm:border-b-0 sm:pb-0 2xl:items-center">
              <p className="w-1/2 text-lg sm:w-[240px] lg:min-w-[15%]">Lock Content</p>

              <div className="flex size-auto w-1/2 items-center justify-end gap-4 sm:w-auto">
                <Controller
                  name="lockContent"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="sm:absolute sm:-right-12 sm:top-1/2 sm:z-10 sm:-translate-y-1/2"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Make your upload exclusive for token holders, for amount, simply add the
                        total amount of token holdings required to view your post!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="ml-0 mt-6 flex w-full flex-wrap items-center justify-between gap-0 sm:ml-6 sm:mt-0 sm:size-auto sm:gap-6">
                <Controller
                  name="token"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      disabled={!isLockedContent}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-8 w-[25%] rounded-full border-2 bg-transparent px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token: any, i: number) => (
                          <SelectItem key={i} value={token.value}>
                            <div className="flex items-center justify-center gap-1 text-xs sm:gap-2 sm:text-sm">
                              <Avatar className="size-4 sm:size-8">
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
                      <SelectTrigger className="h-8 w-[30%] rounded-full border-2 bg-transparent px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm">
                        <SelectValue placeholder="Network" />
                      </SelectTrigger>
                      <SelectContent>
                        {networksForAToken.length === 0 && <p>No networks available</p>}
                        {networksForAToken.map((token, i) => (
                          <SelectItem key={i} value={token.value}>
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
                  className="h-8 w-[40%] rounded-full border-none px-2 text-xs sm:h-10 sm:w-[110px] sm:px-5 sm:text-sm"
                  {...form.register("lockContentAmount")}
                />
              </div>
            </div>

            <div className="relative flex size-auto flex-wrap items-start justify-start border-b-2 border-gray-300/5 pb-8 sm:flex-nowrap sm:border-b-0 sm:pb-0 2xl:items-center">
              <p className="w-1/2 text-lg sm:w-[240px] lg:min-w-[15%]">Pay Per View</p>

              <div className="flex size-auto w-1/2 items-center justify-end gap-4 sm:w-auto">
                <Controller
                  name="payPerView"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="sm:absolute sm:-right-12 sm:top-1/2 sm:z-10 sm:-translate-y-1/2"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Charge a one time pay-per-view fee for accessing your upload or live stream.
                        For amount, enter the one time fee you wish to charge each individual
                        viewer. Only a 10% fee is charged on each transaction
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="ml-0 mt-6 flex w-full flex-wrap items-center justify-between gap-0 sm:ml-6 sm:mt-0 sm:size-auto sm:gap-6">
                <Controller
                  name="chain"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      disabled={!isPayPerView}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-8 w-[25%] rounded-full border-2 bg-transparent px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {payPerViewTokens.map((token: any, i: number) => (
                          <SelectItem key={i} value={token.value}>
                            <div className="flex items-center justify-center gap-1 text-xs sm:gap-2 sm:text-sm">
                              <Avatar className="size-4 sm:size-8">
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
                  name="payPerViewNetwork"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      disabled={!isPayPerView}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-8 w-[30%] rounded-full border-2 bg-transparent px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm">
                        <SelectValue placeholder="Network" />
                      </SelectTrigger>
                      <SelectContent>
                        {networksForPPVToken.map((token, i) => (
                          <SelectItem key={i} value={token.value}>
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
                  className="h-8 w-[40%] rounded-full border-none px-2 text-xs sm:h-10 sm:w-[110px] sm:px-5 sm:text-sm"
                  {...form.register("ppvAmount")}
                />
              </div>
            </div>

            <div className="relative flex size-auto flex-wrap items-start justify-start border-b-2 border-gray-300/5 pb-8 sm:flex-nowrap sm:border-b-0 sm:pb-0 2xl:items-center">
              <p className="w-1/2 text-lg sm:w-[240px] lg:min-w-[15%]">Watch2Earn</p>
              <div className="flex size-auto w-1/2 items-center justify-end gap-4 sm:w-auto">
                <Controller
                  name="bounty"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="sm:absolute sm:-right-12 sm:top-1/2 sm:z-10 sm:-translate-y-1/2"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Strap a bounty to your upload and make it watch2earn to reward your fans and
                        build a community, fast. In the first two boxes, enter the number of viewers
                        and commentor you wish to reward. The amount box is the amount each comment
                        or view will earn. Only a 10% fee is charged for this service.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-0 mt-6 flex w-full flex-wrap items-center justify-between gap-y-3 sm:ml-6 sm:mt-0 sm:size-auto sm:gap-6">
                <Controller
                  name="bountyChain"
                  control={form.control}
                  render={({ field }) => (
                    <Select disabled={!isBounty} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 w-[25%] rounded-full border-2 bg-transparent px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedTokensForChain.map((token, key) => (
                          <SelectItem key={key} value={token.value}>
                            <div className="flex items-center justify-center gap-1 text-xs sm:gap-2 sm:text-sm">
                              <Avatar className="size-4 sm:size-8">
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
                <Button
                  disabled
                  className="h-8 w-[30%] rounded-full px-2 text-xs sm:h-10 sm:w-[150px] sm:px-4 sm:text-sm"
                >
                  {supportedNetworks.find((e) => e.chainId === chainId)?.value}
                </Button>
                <Input
                  disabled={!isBounty}
                  type="text"
                  placeholder="First X Viewer"
                  className="h-8 w-[40%] rounded-full border-none px-2 text-xs sm:h-10 sm:w-[110px] sm:px-5 sm:text-sm"
                  {...form.register("bountyFirstXViewer")}
                />
                <Input
                  disabled={!isBounty}
                  type="text"
                  placeholder="First X Comments"
                  className="h-8 w-[48.5%] rounded-full border-none px-2 text-xs sm:h-10 sm:w-[110px] sm:px-5 sm:text-sm"
                  {...form.register("bountyFirstXComment")}
                />
                <Input
                  disabled={!isBounty}
                  type="text"
                  placeholder="Amount"
                  className="h-8 w-[48.5%] rounded-full border-none px-2 text-xs sm:h-10 sm:w-[110px] sm:px-5 sm:text-sm"
                  {...form.register("bountyAmount")}
                />
              </div>
            </div>
            <div className="relative flex size-auto flex-wrap items-start justify-start border-b-2 border-gray-300/5 pb-8 sm:flex-nowrap sm:border-b-0 sm:pb-0 2xl:items-center">
              <p className="w-1/2 text-lg sm:w-[240px] lg:min-w-[15%]">Add Subscription</p>
              <div className="flex size-auto w-1/2 items-center justify-end gap-4 sm:w-auto">
                <Controller
                  name="isRequireSubscription"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        className="sm:absolute sm:-right-12 sm:top-1/2 sm:z-10 sm:-translate-y-1/2"
                      >
                        <Info className="size-5 text-gray-500 dark:text-white/50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>
                        Strap a bounty to your upload and make it watch2earn to reward your fans and
                        build a community, fast. In the first two boxes, enter the number of viewers
                        and commentor you wish to reward. The amount box is the amount each comment
                        or view will earn. Only a 10% fee is charged for this service.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-0 mt-6 flex w-full flex-wrap items-center justify-between gap-y-3 sm:ml-6 sm:mt-0 sm:size-auto sm:gap-6">
                <Controller
                  name="plans"
                  control={form.control}
                  render={({ field }) => (
                    <ReactSelect
                      isMulti
                      isDisabled={!isRequireSubscription}
                      options={transformedPlans}
                      value={field.value?.map((id: any) =>
                        transformedPlans.find((option: any) => option.value === id)
                      )}
                      onChange={(selectedOptions) =>
                        field.onChange(selectedOptions.map((option: any) => option.value))
                      }
                      placeholder="Select Plans"
                      classNamePrefix="react-select rounded-full"
                      theme={(base) =>
                        theme == "light"
                          ? base
                          : {
                              ...base,
                              colors: {
                                ...base.colors,
                                primary: "#4f8aef", // Highlight color (matches blue button from the image)
                                primary25: "#354152", // Hover state
                                neutral0: "#111", // Background color of the select
                                neutral5: "#222", // Border color
                                neutral10: "#333", // Placeholder color
                                neutral20: "#444" // Option hover color
                              },
                              spacing: {
                                ...base.spacing,
                                controlHeight: 35 // Adjust the control height
                              }
                            }
                      }
                    />
                  )}
                />
              </div>
            </div>
            <Button
              className="relative h-auto w-full overflow-hidden rounded-md py-4 text-2xl sm:text-4xl"
              size="lg"
              variant="gradientOne"
              disabled={uploading}
              onClick={form.handleSubmit(handleOnUploadAndMint)}
            >
              {!uploading ? (
                "Upload Post / Mint NFT"
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  <span className="relative z-10 text-white">uploading...</span>
                </div>
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
