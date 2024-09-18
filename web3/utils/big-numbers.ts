import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "ethers/lib/utils";

/* ================================================================================================= */

export const isSameAddress = (
  addressA: string | BigNumber,
  addressB: string | BigNumber
): boolean => {
  if (!addressB || !addressB) return false;
  if (addressA.toString().toLowerCase() === addressB.toString().toLowerCase()) return true;
  return false;
};

export const getReadableNumber = (
  numberData: number | string | BigNumber | null | undefined,
  decimals = 18
): string => {
  try {
    if (!numberData?.toString() || numberData.toString().indexOf("--") > -1) return "0";
    if (typeof decimals === "undefined") return "0";
    const readableNumberString = formatUnits(numberData?.toString(), decimals).toString();
    return readableNumberString;
  } catch (error) {
    // TODO: Handle error
  }
  return "0";
};

export const getContractNumber = (
  numberData: number | string | null | undefined,
  decimals = 18
): string => {
  try {
    if (!numberData || !decimals) return "0";
    if (!numberData.toString()) return "0";
    numberData = numberData.toString();
    const digits = numberData.split(".");
    if (digits.length > 1) numberData = digits[0] + "." + digits[1].substr(0, decimals);
    const contractNumberString = parseUnits(numberData?.toString(), decimals).toString();
    return contractNumberString;
  } catch (error) {
    // TODO: Handle error
  }
  return "0";
};

export const getContractBN = (
  numberData: number | string | null | undefined,
  decimals = 18
): BigNumber => {
  try {
    return BigNumber.from(getContractNumber(numberData, decimals));
  } catch (error) {
    // TODO: Handle error
  }
  return BigNumber.from("0");
};

export const parseBigNumberToHex = (numberData: Record<string, unknown>): string => {
  if (!numberData) throw new Error("Number Error");
  if (numberData.hex) return numberData.hex.toString();
  return numberData.toString();
};

export function getFormattedNum(
  number?: number | string,
  digit?: number | undefined,
  isKeepDecimal?: boolean
): string {
  try {
    if (digit === undefined) digit = 2;
    if (!isKeepDecimal) isKeepDecimal = false;
    if (!number || isNaN(Number(number))) return parseFloat("0").toFixed(digit);
    if (parseFloat(parseFloat(number + "").toFixed(digit)) === 0) digit += 4;
    if (parseFloat(parseFloat(number + "").toFixed(digit)) === 0) digit += 4;
    if (parseFloat(parseFloat(number + "").toFixed(digit)) === 0) digit += 4;

    const parts = parseFloat(number + "")
      .toFixed(digit)
      .split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (!isKeepDecimal && parts[1]?.length) {
      let part1 = parts[1];
      for (let i = 0; i < parts[1].length - 1; i++) {
        if (part1.substring(-1) !== "0") break;
        part1 = part1.slice(0, -1);
      }
      parts[1] = part1;
    }
    return parts.join(".");
  } catch (error) {
    // TODO: Handle error
  }
  return "0.0";
}
