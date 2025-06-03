import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/configs";

export async function POST(req: NextRequest) {
  const isProduction = env.NODE_ENV === "production";

  try {
    const { wallet_information, chain_information, user_information, connected } = await req.json();
    const cookie = cookies();

    if (!connected) {
      cookie.delete("wallet_information");
      cookie.delete("chain_information");
      cookie.delete("user_information");
      return NextResponse.json({ message: "Ok" });
    }

    if (wallet_information) {
      cookie.set("wallet_information", JSON.stringify(wallet_information), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction
      });
    }
    if (chain_information) {
      cookie.set("chain_information", JSON.stringify(chain_information), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction
      });
    }
    if (user_information) {
      cookie.set("user_information", JSON.stringify(user_information), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction
      });
    }
    return NextResponse.json({ message: "Ok" });
  } catch (err) {
    return NextResponse.json({ message: "Ok" });
  }
}

export function DELETE() {
  const cookie = cookies();
  cookie.delete("account");
  return NextResponse.json({ message: "Ok" });
}
