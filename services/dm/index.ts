import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";

interface SearchUserResponse {
  success: boolean;
  data?: {
    users: any[];
  };
}
export async function searchUserOrGroup(data: any) {
  console.log("searchUserOrGroup");
  if (data) {
    const query = objectToGetParams(
      removeUndefined({
        q: data.q
      })
    );
    const url = `/dm/search${query}`;
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60 }
    });
    return res;
  }
}

export async function fetchDmMessages(
  id: string,
  data: { q?: string | null; skip: number; limit: number; address: `0x${string}` | null }
) {
  console.log("fetchDmMessages");
  if (data) {
    const query = objectToGetParams(
      removeUndefined({
        q: data?.q,
        skip: data.skip | 0,
        limit: data.limit || 10,
        address:data.address
      })
    );
    const url = `/dm/messages/${id}${query}`;
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60 }
    });
    return res;
  }
}
