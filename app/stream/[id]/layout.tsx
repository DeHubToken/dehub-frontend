import { safeParseCookie } from "@/libs/cookies";
import { getNFT } from "@/services/nfts";
import { getImageUrl } from "@/web3/utils/url";
import { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  children: React.ReactNode;
  params: { id: string};
};

// Function to dynamically generate metadata based on NFT data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tokenId = Number(params.id);
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);

  // Validate the tokenId
  if (isNaN(tokenId)) {
    return {
      title: "Invalid NFT - Dehub",
      description: "The requested NFT does not exist.",
    };
  }

  // Fetch NFT data
  const response:any = await getNFT(tokenId, user?.address as string);
  if (!response) {
    return {
      title: "NFT Not Found - Dehub",
      description: "This NFT does not exist on Dehub.",
    };
  }

  const nftData = response.data.result;

  // Create metadata dynamically based on the NFT data
  return {
    title: `${nftData.name} - NFT on Dehub`,
    description: nftData.description || "Explore this unique NFT on Dehub.",
    keywords: nftData.category.join(", "),
    openGraph: {
      title: `${nftData.name} - NFT on Dehub`,
      description: nftData.description || "Explore this unique NFT on Dehub.",
      images: [
        {
          url: getImageUrl(nftData.imageUrl) || "/images/default-nft.png",
          width: 800,
          height: 600,
          alt: nftData.name,
        },
      ],
      type: "video.movie",
      url: `https://dehub.io/nft/${nftData.tokenId}`,
      siteName: "Dehub",
      locale: "en_US",
    },
  };
}

// Layout component that applies the metadata and renders the page
export default function StreamInfoLayout({ children }: Props) {
  return (
    <main className="relative h-auto w-full">
      <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start xl:flex-row xl:justify-between">
        {children}
      </div>
    </main>
  );
}
