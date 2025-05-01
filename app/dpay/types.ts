export type TnxStatus = "pending" | "succeeded" | "failed" | "init" | "Token_verified";
export interface TnxData {
  _id: string;
  receiverId: string;
  sessionId: string;
  amount: number;
  tokenSymbol: string;
  tokenAddress?: string;
  chainId: number;
  status_stripe: TnxStatus;
  txnHash?: string;
  note?: string;
  type: string;
  tokenSendStatus: "not_sent" | "sending" | "sent" | "cancelled" | "failed"|"processing";
  tokenSendRetryCount: number;
  receiverAddress: string;
  tokenSendTxnHash?: string;
  approxTokensToReceive?: string;
  approxTokensToSent?: string;
  lastTriedAt?: string;
  createdAt: string;
  updatedAt?: string;
  currency?: string;
  fee?:number;
  net?:number;
  exchange_rate?:number; 
}

export interface TnxResponse {
  error?: string;
  success: boolean;
  data?: {
    total?: number;
    tnxs?: TnxData[];
  };
}
