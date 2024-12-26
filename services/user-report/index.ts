import { api } from "@/libs/api";

// This function creates a group chat
export async function blockDM(data: { conversationId: string; reason: string; address: string }) {
  const url = `/dm/block`; // API endpoint for creating a group chat
  try {
    // Make the API request to create a group chat
    const res = await api<{}>(url, {
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
