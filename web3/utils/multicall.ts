type Props = {
  contract?: {
    address: string;
    interface?: {
      encodeFunctionData: (arg0: string, arg1: unknown[]) => unknown;
      decodeFunctionResult: (arg0: string, arg1: unknown[]) => unknown[];
    };
  };
  functionName: string;
  param: unknown[];
  returnKey?: string;
}[];

export type MultiCallProps = Props;

export function makeAggregateCalldata(props: Props) {
  try {
    const calldata = props?.map((item) => ({
      target: item?.contract?.address,
      callData: item?.contract?.interface?.encodeFunctionData(item?.functionName, item?.param)
    }));
    return calldata;
  } catch (error) {
    return [];
  }
}

type ReturnResult = {
  success: boolean;
  returnData: unknown[];
}[];
function parseAggregateCalldata(returnResult: ReturnResult, callObjectArray: Props) {
  const returnData: Record<string, string> = {};

  callObjectArray.forEach((item, idx: number) => {
    const returnKey = item.returnKey || item.functionName;
    if (!returnResult[idx].success) return;
    if (returnKey) {
      const decodedResult = item?.contract?.interface?.decodeFunctionResult(
        item.functionName,
        returnResult[idx].returnData
      );
      let result = "";
      if (decodedResult && decodedResult.length === 1) result = decodedResult.toString();
      returnData[returnKey as keyof typeof returnData] = result;
    }
  });
  return returnData;
}

export type MulticallContract = {
  tryAggregate: (
    arg0: boolean,
    arg1: {
      target: string | undefined;
      callData: unknown;
    }[]
  ) => Promise<ReturnResult>;
};

export async function multicallRead(multicallContract: MulticallContract, callObjectArray: Props) {
  try {
    let returnData = {};
    const fetchUnit = 1400;
    for (let i = 0; i < callObjectArray.length; i += fetchUnit) {
      const tempCallDataArray = callObjectArray.filter(
        (item, idx) => idx >= i && idx < i + fetchUnit
      );
      const calldata = makeAggregateCalldata(tempCallDataArray);

      const result = await multicallContract.tryAggregate(false, calldata);
      const tempReturnData = parseAggregateCalldata(result, tempCallDataArray);
      returnData = { ...returnData, ...tempReturnData };
    }
    return returnData;
  } catch (e) {
    // TODO: handle error
    return null;
  }
}
