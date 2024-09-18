import pinataSDK from "@pinata/sdk";

import { env } from "@/configs";

const pinata = pinataSDK(env.pinataKey!, env.pinataSecretApiKey!);

type IpfsHashResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

export const getIpfsHash = async (data: Record<string, unknown>) => {
  const result = await pinata.pinJSONToIPFS(data);
  const hash = result.IpfsHash;
  return hash;
};

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

export const getGatewayUrl = async (ipfsHash: string) =>
  "https://gateway.pinata.cloud/ipfs/".concat(ipfsHash);
