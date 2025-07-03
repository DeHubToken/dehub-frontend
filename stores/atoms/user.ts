import { atom } from "jotai";

export interface User {
  balance?: number;
  balanceData?: { tokenAddress: string; chainId: number; walletBalance: number; staked: number }[];
  depositedBalance?: number;
  username?: string;
  displayName?: string;
  email?: string;
  avatarImageUrl?: string;
  isLiked?: boolean;
  coverImageUrl?: string;
  aboutMe?: string;
  facebookLink?: string;
  twitterLink?: string;
  discordLink?: string;
  instagramLink?: string;
  tiktokLink?: string;
  youtubeLink?: string;
  telegramLink?: string;
  balances?: number[];
  walletBalances?: number[] | null;
  badge?: { name: string; amount: number };
  receivedTips?: number;
  sentTips?: number;
  address?: string;
  stakedDHB?: number;
  uploads?: number;
  followers?: string[];
  followings?: string[];
  likes?: string[];
  unlocked?: string[];
  createdAt?: string;
  info?: {
    walletBalances?: { [key: string]: number };
  };
}

export const userAtom = atom<User | null>(null);
export const saveUserAtom = atom(null, (get, set, user: User) => {
  set(userAtom, user);
});

export const isUsernameSetAtom = atom(true);

export const isSignedAtom = atom(true);
