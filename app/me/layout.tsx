import "server-only";

import { cookies } from "next/headers";
import { Metadata } from "next";
import { safeParseCookie } from "@/libs/cookies";
import { getAccount } from "@/services/user";
import { getAvatarUrl } from "@/web3/utils/url";

export async function generateMetadata(): Promise<Metadata> {
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  

  let userMetadata: Metadata = {
    title: "User Profile - Dehub",
    description: "Check out the user profile on Dehub.",
    openGraph: {
      title: "User Profile - Dehub",
      description: "View user details and their collections on Dehub.",
      url: "https://dehub.io/profile",
      siteName: "Dehub",
      images: [
        {
          url: "https://dehub.io/default-avatar.png",
          width: 800,
          height: 600,
          alt: "Dehub User Profile",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };

  if (user) {
    const res = await getAccount(user.address);



    if (res.success) {
      const userData = res.data.result;
      const imageSrc = getAvatarUrl(userData.avatarImageUrl || "");

      userMetadata = {
        title: `${userData?.username || userData.displayName} - Profile on Dehub.io`,
        description: `Explore the profile of ${userData?.username || userData.displayName} on Dehub.io.`,
        openGraph: {
          title: `${userData?.username || userData.displayName} - Profile on Dehub`,
          description: `View ${userData?.username}'s profile and collections on Dehub.`,
          url: `https://dehub.io/profile/${userData?.username}`,
          siteName: "Dehub",
          images: [
            {
              url: imageSrc || "https://dehub.io/default-avatar.png",
              width: 800,
              height: 600,
              alt: `${userData?.username || userData.displayName}'s Avatar`,
            },
          ],
          locale: "en_US",
          type: "profile",
        },
      };
    }
  }

  return userMetadata;
}

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between px-4 py-20 md:px-8">
      {children}
    </main>
  );
}
