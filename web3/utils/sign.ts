import type { JsonRpcSigner } from "@ethersproject/providers";

type Library = JsonRpcSigner;

export const performPersonalSign = (library: Library, account: string, signMessage: string) => {
  if (!account) throw new Error("Account invalid.");
  if (!library) throw new Error("Please connect to your wallet.");
  if (!library.signMessage) throw new Error("Provider not ready");
  return library.signMessage(signMessage);
};
