import { env } from "@/configs"; // Ensure you have your env variables set 

// Dynamically import Pinata SDK only on the server-side or with condition
let pinataSDK:any;
if (typeof window === "undefined") {
  pinataSDK = require("@pinata/sdk"); // Dynamically import on the server-side
}

type IpfsHashResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

// Server-side only function for Pinata interaction
export const getIpfsHash = async (data: Record<string, unknown>) => {
  if (!pinataSDK) return;

  const pinata = pinataSDK(env.pinataKey!, env.pinataSecretApiKey!);
  const result = await pinata.pinJSONToIPFS(data);
  const hash = result.IpfsHash;
  return hash;
};

// Function to handle file upload to Pinata
export const getIpfsHashFromFile = async (...files: File[]) => {
  const headers = new Headers();
  const formData = new FormData();

  headers.append("pinata_api_key", env.pinataKey!);
  headers.append("pinata_secret_api_key", env.pinataSecretApiKey!);

  for (const file of files) formData.append("file", file);

  const requestOptions = {
    headers,
    method: "POST",
    body: formData
  };

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions);
  const data: IpfsHashResponse = await response.json();

  return data.IpfsHash;
};

// Generate gateway URL
export const getGatewayUrl = async (ipfsHash: string) =>   "https://gateway.pinata.cloud/ipfs/".concat(ipfsHash);
