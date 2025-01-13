"use server";

import { revalidatePath } from "next/cache";

import { voteNFT } from "@/services/nfts";
import { commentOnNFT, commentOnNFTWithImage } from "@/services/user";

export async function postComment(params: {
  streamTokenId: number;
  account: string;
  content: string;
  commentId?: number;
  timestamp: number;
  sig: string;
  file?: any;
}) {
  const { streamTokenId, timestamp, sig, account, content, commentId, file } = params;
  if (!account) return { success: false, error: "Please connect your wallet." };
  revalidatePath(`/stream/${streamTokenId}`);
 
  return commentOnNFT({
    streamTokenId,
    account,
    content,
    commentId,
    timestamp,
    sig
  });
}

export async function voteOnNFT(params: {
  account: string;
  streamTokenId: number;
  vote: boolean;
  sig: string;
  timestamp: number;
}) {
  const { account, streamTokenId, vote, sig, timestamp } = params;
  if (!account) return { success: false, error: "Please connect your wallet." };
  return voteNFT({
    account,
    streamTokenId,
    vote,
    sig,
    timestamp
  });
}

export async function claimBounty(tokenId: number) {
  revalidatePath(`/stream/${tokenId}`, "page");
}

export async function unlockPPV(tokenId: number) {
  revalidatePath(`/stream/${tokenId}`, "page");
}
