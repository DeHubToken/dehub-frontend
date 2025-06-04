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

// Cache for leaderboard data
let leaderboardCache: {
  data: LeaderboradResponse | null;
  timestamp: number;
  sort: string;
} = {
  data: null,
  timestamp: 0,
  sort: ""
};

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

export async function getLeaderborard(params?: { sort?: string }) {
  const { sort = "holdings" } = params || {};
  
  // Check if we have valid cached data
  const now = Date.now();
  if (
    leaderboardCache.data &&
    leaderboardCache.sort === sort &&
    now - leaderboardCache.timestamp < CACHE_DURATION
  ) {
    return { success: true, data: leaderboardCache.data };
  }

  try {
    const query = objectToGetParams({ sort });
    const url = `/leaderboard${query}`;
    const res = await api<LeaderboradResponse>(url, {
      next: { revalidate: 2 * 60, tags: ["leaderboard"] }
    });

    // Update cache if request was successful
    if (res.success) {
      leaderboardCache = {
        data: res.data,
        timestamp: now,
        sort
      };
    }

    return res;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    // If we have stale cache data, return it as fallback
    if (leaderboardCache.data) {
      return { success: true, data: leaderboardCache.data };
    }
    return { success: false, error: "Failed to fetch leaderboard data" };
  }
}
