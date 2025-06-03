// helpers/swapHelpers.ts
import { ethers } from "ethers";
import FACTORY_ABI from "@/web3/abis/factory.json";
import QUOTER_ABI from "@/web3/abis/quoter.json";
import SWAP_ROUTER_ABI from "@/web3/abis/swaprouter.json";
import POOL_ABI from "@/web3/abis/pool.json";
import WETH_ABI from "@/web3/abis/weth.json";

export const POOL_FACTORY_CONTRACT_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
export const QUOTER_CONTRACT_ADDRESS = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";
export const SWAP_ROUTER_CONTRACT_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
export const WETH_CONTRACT_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
export const DHB_CONTRACT_ADDRESS = "0xB0224B9C622a82C55dD14184FC82E7537bE1D096";

const chainId = 11155111;

// Our token config
export const tokens = {
  WETH: {
    chainId,
    address: WETH_CONTRACT_ADDRESS,
    decimals: 18,
    symbol: "ETH",
    name: "Wrapped Ether"
  },
  DHB: {
    chainId,
    address: DHB_CONTRACT_ADDRESS,
    decimals: 18,
    symbol: "DHB",
    name: "DHB"
  }
};

export async function getTokenBalance(
  tokenAddress: string,
  decimals: number,
  signer: ethers.Signer
) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, WETH_ABI, signer);
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    return balance;
  } catch (error) {
    console.error("Error in getTokenBalance:", error);
    throw error;
  }
}

export async function approveToken(
  tokenAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, WETH_ABI, signer);
    const tx = await tokenContract.approve(SWAP_ROUTER_CONTRACT_ADDRESS, amount);
    await tx.wait();
  } catch (error) {
    console.error("Approval error:", error);
    throw new Error("Token approval failed");
  }
}

export async function getPoolInfo(
  factoryContract: ethers.Contract,
  tokenIn: { address: string },
  tokenOut: { address: string }
) {
  const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, 500);
  if (!poolAddress || poolAddress === ethers.constants.AddressZero) {
    throw new Error("Failed to get pool address");
  }
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, factoryContract.provider);
  const fee = await poolContract.fee();
  return { poolContract, fee };
}

export async function quoteAndLogSwap(
  quoterContract: ethers.Contract,
  fee: number,
  signer: ethers.Signer,
  amountIn: ethers.BigNumber,
  tokenIn: { address: string },
  tokenOut: { address: string }
) {
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const quoted = await quoterContract.callStatic.quoteExactInputSingle({
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    fee: fee,
    recipient: await signer.getAddress(), 
    deadline: deadline,
    amountIn: amountIn,
    sqrtPriceLimitX96: 0
  });
  // If the contract returns [amount, 0, ...] or a single BigNumber, handle it
  const amountOut = quoted[0] ? quoted[0] : quoted;
  return amountOut;
}

export function prepareSwapParamsObject(
  fee: number,
  amountIn: ethers.BigNumber,
  amountOutMinimum: ethers.BigNumber,
  signer: ethers.Signer,
  tokenIn: { address: string },
  tokenOut: { address: string }
) {
  return {
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    fee: fee,
    recipient: signer.getAddress, 
    amountIn: amountIn,
    amountOutMinimum: amountOutMinimum,
    sqrtPriceLimitX96: 0
  };
}

export async function executeSwap(
  swapRouter: ethers.Contract,
  params: any,
  signer: ethers.Signer
) {
  params.recipient = await signer.getAddress();
  const txResponse = await swapRouter[
    "exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))"
  ](params);
  await txResponse.wait();
}
