import { api } from "@/libs/api";

export const createLiveStream = async (data: any) => {
  return api<any>(`/live`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const broadcastStream = async (url: string, data: any) => {
  return api<any>(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const getLiveStream = async (streamId: string) => {
  return api<any>(`/live/${streamId}`, {
    method: "GET"
  });
};

export const checkIfBroadcastOwner = async (
  address: string | `0x${string}` | undefined,
  stream: any
) => {
  return stream.address === address;
};
