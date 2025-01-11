import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";

import { durations } from "@/configs";

interface SearchUserResponse {
  success: boolean;
  data?: {
    users: any[];
    message?: string;
  };
  message?: string;
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
  } catch (error: any) {
    console.error("Error creating group chat:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for creating group chat.");
    } else if (error?.response?.status === 401) {
      throw new Error("Unauthorized. Please log in to create a group chat.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while creating group chat. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while creating the group chat.");
    }
  }
} // This function creates a group chat
export async function saveDMTnx(data: any) {
  const url = `/dm/tnx`; // API endpoint for creating a group chat
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
  } catch (error: any) {
    console.error("Error creating group chat:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for creating group chat.");
    } else if (error?.response?.status === 401) {
      throw new Error("Unauthorized. Please log in to create a group chat.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while creating group chat. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while creating the group chat.");
    }
  }
}
export async function updateDMTnx(data: any) {
  const url = `/dm/tnx`; // API endpoint for creating a group chat
  try {
    // Make the API request to create a group chat
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "PUT", // HTTP method
      headers: {
        "Content-Type": "application/json" // Specify the content type
      },
      body: JSON.stringify(data)
    });

    // Returning the API response
    return res;
  } catch (error: any) {
    console.error("Error creating group chat:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for creating group chat.");
    } else if (error?.response?.status === 401) {
      throw new Error("Unauthorized. Please log in to create a group chat.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while creating group chat. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while creating the group chat.");
    }
  }
}
interface JoinGroupData {
  groupId: string;
  planId: string;
  address: string;
  userAddress: string;
}
// This function joins a group
export async function joinGroup(data: JoinGroupData) {
  const url = `/dm/group/join`; // API endpoint for joining a group
  try {
    // Make the API request to join a group
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json" // Specify the content type
      },
      body: JSON.stringify(data)
    });

    // Returning the API response
    return res;
  } catch (error: any) {
    console.error("Error joining group:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for joining the group.");
    } else if (error?.response?.status === 401) {
      throw new Error("Unauthorized. Please log in to join the group.");
    } else if (error?.response?.status === 404) {
      throw new Error("Group not found. Please check the group ID and try again.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while joining the group. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while joining the group.");
    }
  }
}

interface ExitGroupData {
  conversationId: string;
  address: string;
  userAddress: string;
}
export async function exitGroup(data: ExitGroupData) {
  try {
    const url = `/dm/group-user-exit`;
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json" // Specify the content type
      },
      body: JSON.stringify(data)
    });
    return res;
  } catch (error:any) {
    console.error("Error joining group:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for joining the group.");
    } else if (error?.response?.status === 401) {
      throw new Error("Unauthorized. Please log in to join the group.");
    } else if (error?.response?.status === 404) {
      throw new Error("Group not found. Please check the group ID and try again.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while joining the group. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while joining the group.");
    }
  }
}

// This function fetches groups by plan
export async function fetchGroupsByPlan(data: { id: string; duration?: string }) {
  const query = objectToGetParams(removeUndefined({ ...data }));
  const url = `/dm/plan/${data.id}/${query}`;
  try {
    // Make the API request to fetch groups
    const res = await api<{ result: SearchUserResponse }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60 }
    });

    // Returning the API response
    return res;
  } catch (error: any) {
    console.error("Error fetching groups by plan:", error);

    // Check for known error formats
    if (error?.response?.status === 400) {
      throw new Error("Invalid data provided for fetching groups by plan.");
    } else if (error?.response?.status === 404) {
      throw new Error("No groups found for the specified plan.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching groups by plan. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred while fetching groups by plan.");
    }
  }
}
