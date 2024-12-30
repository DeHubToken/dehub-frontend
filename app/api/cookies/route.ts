import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { wallet_information, chain_information, user_information, connected } = await req.json();
    const cookie = await cookies();

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
        secure: process.env.NODE_ENV === "production"
      });
    }
    if (chain_information) {
      cookie.set("chain_information", JSON.stringify(chain_information), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });
    }
    if (user_information) {
      cookie.set("user_information", JSON.stringify(user_information), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });
    }
    return NextResponse.json({ message: "Ok" });
  } catch (err) {
    return NextResponse.json({ message: "Ok" });
  }
}

export async function DELETE() {
  const cookie = await cookies();
  cookie.delete("account");
  return NextResponse.json({ message: "Ok" });
}
