import { cookies } from "next/headers";

export function clearCookies() {
  const cookie = cookies();
  cookie.delete("wallet_information");
  cookie.delete("chain_information");
  cookie.delete("user_information");
}

export function safeParseCookie<T>(cookie: string | undefined | null) {
  if (!cookie) return null;

  try {
    const parsed = JSON.parse(cookie);
    return parsed as T;
  } catch (err) {
    clearCookies();
    return null;
  }
}
