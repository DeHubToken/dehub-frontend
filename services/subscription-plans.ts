/* eslint-disable */

import { api } from "@/libs/api";
import objectToGetParams from "@/libs/utils";
import { toast } from "sonner";

export async function createPlan(data: FormData, account: string, sig: string, timestamp: string) {
  if (!sig || !account || !timestamp) {
    toast.error(`Invalid signature  `);
    return;
  }
  const url = `/plans?address=${account?.toLowerCase() ?? ""}&sig=${sig ?? ""}&timestamp=${timestamp ?? ""}`;

  return await api<{}>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
export async function getPlan(id: string) {
  return api<{}>(`/plans/${id}`, {
    method: "GET"
  });
}
export async function getPlans(obj: any) {
  const plans = objectToGetParams(obj);
  return api<{}>(`/plans${plans}`, {
    method: "GET"
  });
}
export async function updatePlan(
  data: FormData,
  id: string | number,
  account: string,
  sig: string,
  timestamp: string
) {
  if (!sig || !account || !timestamp) {
    toast.error("Invalid signature");
    return;
  }
  return api<{}>(
    `/plans/${id}?address=${account?.toLowerCase() ?? ""}&sig=${sig ?? ""}&timestamp=${timestamp ?? ""}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}
export async function buyPlan(data: {
  planId: string;
  account: `0x${string}` | undefined;
  sig: string;
  timestamp: string;
}) {
  if (!data?.sig || !data?.account || !data?.timestamp) {
    toast.error("Invalid signature");
    return;
  }
  return api<{}>(
    `/plan/buy?address=${data.account?.toLowerCase() ?? ""}&sig=${data.sig ?? ""}&timestamp=${data.timestamp ?? ""}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}

export async function webhookPlanCreated(data: {
  planId: string;
  isSuccess: boolean;
  chainId: number;
  token: string;
  sig: string;
  address: string;
  timestamp: string;
  hash: string;
}) {
  if (!data?.sig || !data?.address || !data?.timestamp) {
    toast.error("Invalid signature");
    return;
  }
  return api<{}>(
    `/plan/webhook/create?address=${data.address?.toLowerCase() ?? ""}&sig=${data.sig ?? ""}&timestamp=${data.timestamp ?? ""}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}
export async function webhookPlanPurchased(data: {
  planId: string;
  subId: number;
  isSuccess: boolean;
  chainId: number;
  sig: string;
  address: string;
  timestamp: string;
}) {
  if (!data?.sig || !data?.address || !data?.timestamp) {
    toast.error("Invalid signature");
    return;
  }

  return api<{}>(
    `/plan/webhook/purchased?address=${data.address?.toLowerCase() ?? ""}&sig=${data.sig ?? ""}&timestamp=${data.timestamp ?? ""}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}