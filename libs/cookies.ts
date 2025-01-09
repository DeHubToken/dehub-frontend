import { cookies } from "next/headers";

export async function clearCookies() {
  const cookie = await cookies();
  cookie.delete("wallet_information");
  cookie.delete("chain_information");
  cookie.delete("user_information");
}

export async function safeParseCookie<T>(cookie: string | undefined | null) {
  if (!cookie) return null;

  try {
    const parsed = JSON.parse(cookie);
    return parsed as T;
  } catch (err) {
    await clearCookies();
    return null;
  }
}
