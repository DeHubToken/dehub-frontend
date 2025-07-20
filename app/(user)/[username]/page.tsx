import "server-only";

import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAccount } from "@/services/user";

import { getAvatarUrl } from "@/web3/utils/url";

import { Profile } from "./components/profile";

/* ----------------------------------------------------------------------------------------------- */

type Props = {
  params: { username: string };
  searchParams: any;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { username } = props.params;

  // Default metadata setup
  let metadata: Metadata = {
    title: "User Profile - Dehub",
    description: "Check out the user profile on Dehub.",
    openGraph: {
      title: "User Profile - Dehub",
      description: "View user details and their collections on Dehub.",
      url: `https://dehub.io/${username}`,
      siteName: "Dehub",
      images: [
        {
          url: "https://dehub.io/images/default-avatar.png",
          width: 800,
          height: 600,
          alt: "Dehub User Profile"
        }
      ],
      locale: "en_US",
      type: "website"
    }
  };

  // Fetch account data based on the username
  const res = await getAccount(username);
  if (!res.success) {
    return metadata; // Return default metadata if the user account isn't found
  }

  const userData = res.data.result;
  const imageSrc = getAvatarUrl(userData.avatarImageUrl || "/images/default-avatar.png");

  // Update metadata based on the fetched user data
  metadata = {
    title: `${userData?.username || userData.displayName} - Profile on Dehub.io`,
    description:
      userData.aboutMe ||
      `Explore the profile of ${userData?.username || userData.displayName} on Dehub.io.`,
    twitter: {
      card: "summary_large_image",
      title: `${userData?.username || userData.displayName} - Profile on Dehub`,
      description:
        userData.aboutMe ||
        `Explore the profile of ${userData?.username || userData.displayName} on Dehub.io.`,
      images: [imageSrc]
    },
    openGraph: {
      title: `${userData?.username || userData.displayName} - Profile on Dehub`,
      description: `View ${userData?.username || userData.displayName}'s profile and collections on Dehub.`,
      url: `https://dehub.io/${userData?.username}`,
      siteName: "Dehub",
      images: [
        {
          url: imageSrc,
          width: 800,
          height: 600,
          alt: `${userData?.username || userData.displayName}'s Avatar`
        }
      ],
      locale: "en_US",
      type: "profile"
    }
  };

  return metadata;
}

export default async function Page(props: Props) {
  const { username } = props.params;
  const { searchParams } = props;
  const res = await getAccount(username);

  if (!res.success) {
    return <div>{res.error}</div>;
  }

  if (res.success && !res.data.result?.username) {
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
  const loggedInUserInformation = cookie.get("user_information");
  if (loggedInUserInformation?.value) {
    const userInformation = JSON.parse(loggedInUserInformation.value) as { address: string };
    if (userInformation.address?.toLowerCase() === res.data.result.address?.toLowerCase()) {
      return redirect("/me");
    }
  }

  return <Profile username={username} user={res.data.result} searchParams={searchParams} />;
}
