import "server-only";

import type { Metadata } from "next";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getAccount } from "@/services/user";

import { getImageUrl } from "@/web3/utils/url";

import { Profile } from "./components/profile";

/* ----------------------------------------------------------------------------------------------- */

type Props = {
  params: { username: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { username } = props.params;
  const res = await getAccount(username);
  if (!res.success) {
    return notFound();
  }
  return {
    title: "DeHub | " + res.data.result.username,
    description: res.data.result.aboutMe || "No description provided.",
    keywords: res.data.result.username,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      type: "profile",
      description: res.data.result.aboutMe || "No description provided.",
      username: res.data.result.username,
      title: res.data.result.username,
      locale: "en_US",
      images: [
        {
          url: getImageUrl(res.data.result.avatarImageUrl || "/images/default-avatar.png"),
          width: 800,
          height: 600,
          alt: res.data.result.username
        }
      ]
    }
  };
}

export default async function Page(props: Props) {
  const { username } = props.params;
  const res = await getAccount(username);

  if (!res.success) {
    return <div>{res.error}</div>;
  }

  if (res.success && !res.data.result.username) {
    return (
      <div className="grid h-screen w-full place-items-center">
        <h1 className="text-center text-3xl font-black leading-normal md:text-5xl">
          Account Available.
          <br /> Connect your Wallet and Claim Now!
        </h1>
      </div>
    );
  }

  const cookie = cookies();
  const loggedInuserInformation = cookie.get("user_information");
  if (loggedInuserInformation?.value) {
    const userInformation = JSON.parse(loggedInuserInformation.value) as { address: string };
    if (userInformation.address?.toLowerCase() === res.data.result.address?.toLowerCase()) {
      return redirect("/me");
    }
  }

  return <Profile username={username} user={res.data.result} />;
}
