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
        address: data.address
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
export async function fetchContacts(
  address: string,
  data: { q?: string | null; skip: number; limit: number }
) {
  if (data) {
    const query = objectToGetParams(
      removeUndefined({
        q: data?.q,
        skip: data.skip | 0,
        limit: data.limit || 10
        // address:data.address
      })
    );
    const url = `/dm/contacts/${address}${query}`;
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60 }
    });
    return res;
  }
}
export async function fetchGroups(
  address: string,
  data: { q?: string | null; skip: number; limit: number }
) {
  if (data) {
    const query = objectToGetParams(
      removeUndefined({
        q: data?.q,
        skip: data.skip | 0,
        limit: data.limit || 10
        // address:data.address
      })
    );
    const url = `/dm/group/${address}${query}`;
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60 }
    });
    return res;
  }
}

// Interface for the input data expected when creating a group chat
interface CreateGroupChatData {
  groupName: string;
  users: string[];
  plans: number[];
  address: string;
}

// This function creates a group chat
export async function createGroupChat(data: CreateGroupChatData) {
  const url = `/dm/group`; // API endpoint for creating a group chat
  try {
    // Make the API request to create a group chat
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json" // Specify the content type
      },
      body: JSON.stringify(data)
    });

    // Returning the API response
    return res;
  } catch (error) {
    console.error("Error creating group chat:", error);
    throw new Error("Failed to create group chat"); // Provide a meaningful error message
  }
}
