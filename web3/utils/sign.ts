import type { JsonRpcSigner } from "@ethersproject/providers";

type Library = JsonRpcSigner;

let isSigning = false;

export const performPersonalSign = (library: Library, account: string, signMessage: string) => {
  if (!account) throw new Error("Account invalid.");
  if (!library) throw new Error("Please connect to your wallet.");
  if (typeof library.signMessage !== "function") {
    throw new Error("Provider not ready: `signMessage` is not available.");
  }
  if (isSigning) {
    throw new Error("Signature request already in progress.");
  }

  isSigning = true;
  try {
    return library.signMessage(signMessage);
  } finally {
    isSigning = false;
  }
  // return library.signMessage(signMessage);
};
