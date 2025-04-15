import { getSignInfo } from "@/web3/utils/web3-actions";
import { api } from "./api";

    export async function recordView(tokenId:number,library:string,account:string) {
      if (!account) return;
  
      const result = await getSignInfo(library, account);
      api(
        `/record-view/${tokenId}?sig=${result.sig.trim()}&timestamp=${result.timestamp}&address=${account}`
      );
    }