import { useQuery } from "@tanstack/react-query";

import { getAccount } from "@/services/user";

type Params = { account?: string | null };

export function useGetAccount(params?: Params) {
  const { account } = params || {};
  return useQuery({
    queryKey: ["account", account],
    queryFn: async () => {
      const res = await getAccount(account!);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    enabled: !!account
  });
}
