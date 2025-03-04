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

export async function reasonReportFeed(
  tokenId: number,
  description: string,
  address: string,
  sig: string,
  timestamp: string
) {
  const url = `/nft/reports`;

  const requestBody = {
    tokenId,
    address,
    description,
    sig,
    timestamp
  };

  return await api<any>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
}
// Frontend API call to fetch reports by tokenId
export async function getReportsByTokenId(tokenId: number, page = 1, limit = 20) {
  const url = `/reports/${tokenId}?page=${page}&limit=${limit}`; // API endpoint to fetch reports
  try {
    // Make the API request to fetch the reports
    const res = await api<any>(url, {
      method: "GET" // HTTP method
    });

    // Returning the API response
    return res;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports.");
  }
}
