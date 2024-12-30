import { api } from "@/libs/api";

// This function blocks a user or conversation in a direct message
export async function blockDM(data: {
  conversationId: string;
  reason: string;
  address: string;
  userAddress?: string;
}) {
  const url = data.userAddress ? `/dm/group-user-block` : `/dm/block`; // API endpoint for blocking a DM
  try {
    // Make the API request to block the user or conversation
    const res = await api<{}>(url, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json" // Specify the content type
      },
      body: JSON.stringify(data) // Attach the request data
    });

    // Returning the API response
    return res;
  } catch (error) {
    console.error("Error blocking DM/User:", error);
    throw new Error("Failed to block the user or conversation."); // Provide a meaningful error message
  }
} // This function blocks a user or conversation in a direct message

// This function unblocks a user or conversation in a direct message
export async function unBlockUser(data: {
  conversationId: string;
  address: string;
  reportId: string;
}) {
  const url = `/dm/un-block/${data.conversationId}?address=${data.address}&reportId=${data?.reportId}`; // API endpoint for unblocking a DM
  try {
    // Make the API request to unblock the user or conversation
    const res = await api<any>(url, {
      method: "GET" // HTTP method
    });

    // Returning the API response
    return res;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw new Error("Failed to unblock the user or conversation."); // Provide a meaningful error message
  }
}
