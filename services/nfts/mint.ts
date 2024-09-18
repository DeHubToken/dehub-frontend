import { api } from "@/libs/api";

export async function minNft(data: FormData) {
  return api<{
    r: string;
    s: string;
    v: number;
    createdTokenId: number;
    timestamp: number;
    error: boolean;
    msg?: string;
  }>("/user_mint", {
    method: "POST",
    body: data
  });
}
