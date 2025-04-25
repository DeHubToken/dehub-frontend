import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";

export async function dpayCreateOrder(data: any) {
  const url = `/dpay/checkout`; // API endpoint for creating a group chat
  try {
    // Make the API request to create a group chat
    const res = await api<{ result: any }>(url, {
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

export async function getDpayTnx(filter: any) {
  const query = objectToGetParams(removeUndefined(filter));
  const url = `/dpay/tnxs${query}`;
  try {
    const res = await api<{}>(url, {
      method: "GET"
    });

    return res;
  } catch (error: any) {
    console.error("Error fetching transaction:", error);

    if (error?.response?.status === 400) {
      throw new Error("Invalid session ID provided.");
    } else if (error?.response?.status === 404) {
      throw new Error("Transaction not found.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching transaction.");
    } else {
      throw new Error("An unexpected error occurred while fetching the transaction.");
    }
  }
}

export async function getDpayPrice(filter: { currency: string; chainId: number }) {
  const query = objectToGetParams(removeUndefined(filter));
  const url = `/dpay/price${query}`;

  try {
    const res = await api<any>(url, {
      method: "GET"
    });

    return res; // <- return only the data
  } catch (error: any) {
    console.error("Error fetching price:", error);

    if (error?.response?.status === 400) {
      throw new Error("Invalid request to fetch price.");
    } else if (error?.response?.status === 404) {
      throw new Error("Price data not found.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching price.");
    } else {
      throw new Error("An unexpected error occurred while fetching the price.");
    }
  }
}

export async function getSupply() {
  const url = "/dpay/available/tokens";

  try {
    const res = await api<any>(url, {
      method: "GET"
    });

    return res;
  } catch (error: any) {
    console.error("Error fetching available token supply:", error);

    if (error?.response?.status === 400) {
      throw new Error("Invalid request to fetch available token supply.");
    } else if (error?.response?.status === 404) {
      throw new Error("Token supply data not found.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching token supply.");
    } else {
      throw new Error("An unexpected error occurred while fetching token supply.");
    }
  }
}
export async function getSuccessTotal() {
  const url = "/dpay/total?type=success";

  try {
    const res = await api<any>(url, {
      method: "GET"
    });

    return res;
  } catch (error: any) {
    console.error("Error fetching available token supply:", error);

    if (error?.response?.status === 400) {
      throw new Error("Invalid request to fetch available token total.");
    } else if (error?.response?.status === 404) {
      throw new Error("Total data not found.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching token total;.");
    } else {
      throw new Error("An unexpected error occurred while fetching token total.");
    }
  }
}
