export function truncate(str: string, length: number) {
  if (!str) return "";
  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
}

export function miniAddress(address: string|null|undefined): string {
  if (!address) return ""; // Handle undefined or empty input
  return `${address.substring(0, 6)}...${address.slice(-4)}`;
}
