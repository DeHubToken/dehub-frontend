export const maxStacked = (balanceData:any): number => { 
  return  (balanceData?.reduce((max:number, item:any) => Math.max(max, item.staked), 0)) ?? 0
    }