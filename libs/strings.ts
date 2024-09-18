export function truncate(str: string, length: number) {
  if (!str) return "";
  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
}
