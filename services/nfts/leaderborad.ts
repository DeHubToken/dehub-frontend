import { api } from "@/libs/api";
import objectToGetParams from "@/libs/utils";

export type LeaderboradResponse = {
  result: {
    byWalletBalance: {
      account: string;
      total: number;
      avatarUrl?: string;
      userDisplayName?: string;
      username?: string;
      sentTips?: number;
      receivedTips?: number;
      followers?: number;
      subscribers?: number;
      votes?: number;
      upvotes?: number;
      comments?: number;
      commentsGiven?: number;
    }[];
  };
};

export async function getLeaderborard(params?: { sort?: string }) {
  const { sort } = params || { sort: "holdings" };
  const query = objectToGetParams({ sort });
  const url = `/leaderboard${query}`;
  const res = await api<LeaderboradResponse>(url, {
    next: { revalidate: 2 * 60, tags: ["leaderboard"] }
  });
  return res;
}
