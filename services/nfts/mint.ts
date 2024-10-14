import { api, apiStream } from "@/libs/api";

export async function minNft(data: FormData, callBack?:any) {
  return apiStream<{
    r: string;
    s: string;
    v: number;
    createdTokenId: number;
    timestamp: number;
    error: boolean;
    msg?: string;
  }>("/user_mint", {
    method: "POST",
    body: data,
    headers: {
      Accept: 'text/event-stream',
    },
  }, callBack);
}
export async function updateNftVisibility(data: any) {
  console.log(data);
  
  return api<{
    id: string;
    isHidden: boolean;
  }>("/token_visibility", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json' // Specify the content type
    },
    body: JSON.stringify(data)
  });
}

