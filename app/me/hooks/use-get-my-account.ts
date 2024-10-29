import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetAccount } from "@/hooks/use-get-account";
import { useOptOutSSR } from "@/hooks/use-opt-out-ssr";
import { useActiveWeb3React } from "@/hooks/web3-connect";

export function useGetMyAccount() {
  const router = useRouter();
  const isSSR = useOptOutSSR();
  const [isOwner, setIsOwner] = useState(false);
  const { account } = useActiveWeb3React();
  const { data, error, isError, isLoading: loading } = useGetAccount({ account });

  useEffect(() => {
    if (!data) return;
    if (!account) return;

    if (data.result?.address === account.toLowerCase()) {
      setIsOwner(true);
    } else {
      router.push(`/${data.result?.username}`);
    }
  }, [account, data, router]);

  const isLoading = loading || isSSR;
  return { isLoading, isError, error, isOwner, user: data, isWalletConnected: !!account };
}
