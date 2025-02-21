import "server-only";

import { cookies } from "next/headers";

import { safeParseCookie } from "@/libs/cookies";

import { getAccount } from "@/services/user";

import { NotLinkedAccount } from "./components/not-linked";
import { Profile } from "./components/profile";

export default async function Page(props:any) {
  const {searchParams}=props
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  if (!user) return <NotLinkedAccount />;

  const res = await getAccount(user.address);
  if (!res.success) return <div>{res.error}</div>;

  return <Profile user={res.data.result}  searchParams={searchParams} />;
}