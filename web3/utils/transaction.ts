// FIXME: Remove ts-nocheck, and fix the types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { BigNumber } from "ethers";

import { MaxUint256 } from "@ethersproject/constants";
import { ethers } from "ethers";
import { toast } from "sonner";

import { toBigAmount } from "@/web3/utils/format";

/* ================================================================================================= */

export const GAS_MARGIN = ethers.BigNumber.from(1000);

export function calculateGasMargin(value: BigNumber, margin: BigNumber) {
  const offset = value.mul(margin).div(ethers.BigNumber.from(10000));
  return value.add(offset);
}

export function approveToken(tokenContract, library, contractAddress) {
  async function run() {
    try {
      const estimatedGasPrice = await library
        .getGasPrice()
        .then((gasPrice: BigNumber) =>
          gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100))
        );
      const estimatedSendGasLimit = await tokenContract?.estimateGas.approve(
        contractAddress,
        MaxUint256
      );
      const tx = await tokenContract?.approve(contractAddress, MaxUint256, {
        gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      });
      await tx.wait(1);
      return tx.hash;
    } catch (e) {
      return null;
    }
  }

  return new Promise((resolve) => {
    const promise = run();
    toast.promise(promise, {
      loading: "Running transaction.",
      success: () => "Successfully approved transaction.",
      error: () => "Failed to approve transaction."
    });
    promise.then((result) => resolve(result));
  });
}

export async function depositTokenToContract(contract, library, amount, token) {
  const _toast = toast({ title: "Running transaction." });
  const estimatedGasPrice = await library
    .getGasPrice()
    .then((gasPrice: BigNumber) =>
      gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100))
    );

  const bigNumAmount = ethers.utils.parseUnits(amount.toString(), token?.decimals || 18);
  const estimatedSendGasLimit = await contract?.estimateGas.deposit(bigNumAmount, token?.address);

  try {
    const tx = await contract?.deposit(bigNumAmount, token?.address, {
      gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    });
    await tx.wait(1);

    _toast.dismiss();
    _toast.update({ title: "Deposit confirmed", id: _toast.id });
  } catch (e) {
    _toast.dismiss();
    _toast.update({ title: "Deposit failed", id: _toast.id });
  }
}

export async function claimToken(
  contract,
  library,
  bigNumAmount,
  timestamp,
  v,
  r,
  s,
  claimId,
  tokenAddress
) {
  const _toast = toast({ title: "Running transaction." });

  const estimatedGasPrice = await library
    .getGasPrice()
    .then((gasPrice: BigNumber) =>
      gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100))
    );

  try {
    const estimatedSendGasLimit = await contract?.estimateGas.claim(
      claimId,
      tokenAddress,
      ethers.BigNumber.from(bigNumAmount),
      timestamp,
      v,
      r,
      s
    );

    const tx = await contract?.claim(
      claimId,
      tokenAddress,
      ethers.BigNumber.from(bigNumAmount),
      timestamp,
      v,
      r,
      s,
      {
        gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      }
    );
    await tx.wait(1);

    _toast.dismiss();
    _toast.update({ title: "Success claim transaction", id: _toast.id });
  } catch (e) {
    _toast.dismiss();
    _toast.update({ title: "Failed claim transaction", id: _toast.id });
  }
}

export async function sendTipWithToken(contract, library, amount, token, tokenId, to) {
  const _toast = toast("Confirm Transaction.");
  const estimatedGasPrice = await library
    .getGasPrice()
    .then((gasPrice: BigNumber) =>
      gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100))
    );

  const bigNumAmount = ethers.utils.parseUnits(amount.toString(), token?.decimals || 18);
  const estimatedSendGasLimit = await contract?.estimateGas.sendTip(
    tokenId,
    bigNumAmount,
    to,
    token.address
  );
  let txHash;
  try {
    const tx = await contract?.sendTip(tokenId, bigNumAmount, to, token.address, {
      gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    });
    await tx.wait(1);
    toast.success("Tip confirmed", { id: _toast });
    // _toast.update({ title: "Tip confirmed", id: _toast.id });
    txHash = tx.hash;
  } catch (e) {
    toast.error("Tip failed", { id: _toast });
    // _toast.update({ title: "Tip failed", id: _toast.id });
  } finally {
    _toast.dismiss();
    // eslint-disable-next-line no-unsafe-finally
    return txHash;
  }
}

export async function sendFundsForPPV(contract, library, amount, token, tokenId, to) {
  // const _toast = toast({ title: "Running transaction." });
  const _toast = toast("Confirm Transaction.");
  const estimatedGasPrice = await library
    .getGasPrice()
    .then((gasPrice: BigNumber) =>
      gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100))
    );

  const bigNumAmount = ethers.utils.parseUnits(amount.toString(), token?.decimals || 18);
  let tx;
  try {
    const estimatedSendGasLimit = await contract?.estimateGas.sendFundsForPPV(
      tokenId,
      bigNumAmount,
      to,
      token.address
    );
    tx = await contract?.sendFundsForPPV(tokenId, bigNumAmount, to, token.address, {
      gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    });
    toast.success("Sent PPV funds. Reload stream", { id: _toast });
  } catch (e) {
    toast.error("Transaction failed, please refresh and try again", { id: _toast });
  } finally {
    _toast.dismiss();
    // eslint-disable-next-line no-unsafe-finally
    return tx;
  }
}

export async function mintWithBounty(
  // library,
  controllerContract,
  createdTokenId,
  timestamp,
  v,
  r,
  s,
  bountyToken,
  bountyAmount,
  countOfViewers,
  countOfCommentor
) {
  const bountyAmountBigNumber = toBigAmount(bountyAmount, bountyToken);
  //   const estimatedGasPrice = await library
  // .getGasPrice()
  // .then((gasPrice: BigNumber) =>
  //   gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100))
  // );

  // const estimatedSendGasLimit = await controllerContract?.estimateGas.mintWithBounty(
  //   createdTokenId,
  //   timestamp,
  //   v,
  //   r,
  //   s,
  //   `/${createdTokenId}.json`,
  //   bountyAmountBigNumber,
  //   countOfViewers,
  //   countOfCommentor,
  //   bountyToken.address,
  // );

  const gasLimit = ethers.utils.hexlify(3000000);
  const tx = await controllerContract.mintWithBounty(
    createdTokenId,
    timestamp,
    v,
    r,
    s,
    `/${createdTokenId}.json`,
    bountyAmountBigNumber,
    countOfViewers,
    countOfCommentor,
    bountyToken.address,
    {
      gasLimit
      // gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
      // gasPrice: estimatedGasPrice
    }
  );
  return tx;
  // try {
  // } catch (error) {
  //   console.error("Transaction failed:", error);

  //   if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
  //     console.error("Reason:", error.reason);

  //     if (error.transaction && error.transaction.hash) {
  //       const txReceipt = await ethers.provider.getTransactionReceipt(error.transaction.hash);
  //       if (txReceipt) {
  //         const revertReason = await getRevertReason(txReceipt.transactionHash);
  //         console.error("Revert reason:", revertReason);
  //       } else {
  //         console.error("Transaction receipt not found.");
  //       }
  //     } else {
  //       console.error("Transaction hash not found.");
  //     }
  //   } else {
  //     console.error("Unexpected error:", error);
  //   }

  //   throw error;
  // }
}

// async function getRevertReason(txHash) {
//   const tx = await ethers.provider.getTransaction(txHash);
//   const result = await ethers.provider.call(tx, tx.blockNumber);

//   // Revert reason is in the last 68 bytes of the returned data
//   // (4 bytes function selector + 32 bytes offset + 32 bytes length + revert reason)
//   const str = result.substr(138);
//   const hexStr = `0x${str}`;
//   const bytesArray = ethers.utils.arrayify(hexStr);
//   return ethers.utils.toUtf8String(bytesArray);
// }
