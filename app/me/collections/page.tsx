"use client";

import Link from "next/link";
import { ListFilter } from "lucide-react";

import {
  FeedCard,
  FeedContent,
  FeedHeader,
  FeedImageGallary,
  FeedProfile
} from "@/components/feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="w-full px-6">
      <div className="flex items-center px-2 py-6">
        <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
          Collections
        </h1>
      </div>
      <Tabs defaultValue="saved-posts" className="w-full">
        <div className="flex w-full items-center justify-between">
          <TabsList className="justify-start">
            <TabsTrigger value="saved-posts">Saved posts</TabsTrigger>
            <TabsTrigger value="liked-posts">Liked posts</TabsTrigger>
          </TabsList>
          <Button className="gap-2 rounded-full">
            Filter
            <ListFilter className="size-3 text-zinc-400" />
          </Button>
        </div>
        <TabsContent value="saved-posts" className="mt-4">
          <SavedPosts />
        </TabsContent>
        <TabsContent value="liked-posts" className="mt-4">
          <LikedPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SavedPosts() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((feed, index) => (
        <FeedCard key={index}>
          <FeedHeader>
            <FeedProfile
              name={feed?.mintername}
              avatar={feed?.minterAvatarUrl}
              time={feed?.createdAt?.toString()}
              minter={feed?.minter}
              minterStaked={feed?.minterStaked || 0}
            />
          </FeedHeader>
          <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} feed={feed} />
            <FeedImageGallary images={[{ alt: "", url: "https://placehold.co/160x90" }]} />
          </Link>
        </FeedCard>
      ))}
    </div>
  );
}

function LikedPosts() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((feed, index) => (
        <FeedCard key={index}>
          <FeedHeader>
            <FeedProfile
              name={feed?.mintername}
              avatar={feed?.minterAvatarUrl}
              time={feed?.createdAt?.toString()}
              minter={feed?.minter}
              minterStaked={feed?.minterStaked || 0}
            />
          </FeedHeader>
          <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} feed={feed} />
            <FeedImageGallary images={[{ alt: "", url: "https://placehold.co/160x90" }]} />
          </Link>
        </FeedCard>
      ))}
    </div>
  );
}

const data = [
  {
    name: "Antalyadayız",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Alanyaspor&Galatasaray",
    status: "minted",
    category: ["GALATASARAY"],
    imageUrls: [
      "nfts/images/2056-1.jpg",
      "nfts/images/2056-2.jpg",
      "nfts/images/2056-3.jpg",
      "nfts/images/2056-4.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-03-06T17:41:55.301Z",
    tokenId: 2056,
    totalVotes: {
      for: 4
    },
    mintTxHash: "0x2cf515fc3c5d84ca766383dac47c4eb957b906a040c8c87f7bfcefd14b16060c",
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Galatasaray",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Alanyaspor hazırlıkları",
    status: "minted",
    category: ["GALATASARAY"],
    imageUrls: [
      "nfts/images/2055-1.jpg",
      "nfts/images/2055-2.jpg",
      "nfts/images/2055-3.jpg",
      "nfts/images/2055-4.jpg",
      "nfts/images/2055-5.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-03-05T17:08:15.724Z",
    tokenId: 2055,
    mintTxHash: "0x45b1d9ee8df63084793c4296aa2226ccbaac051e24291d756dc79f5067bb1cfe",
    totalVotes: {
      for: 10
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Araç",
    chainId: 56,
    minter: "0x32f35c75c770cf17271bbe439131c5ce61ffadf0",
    streamInfo: {
      isLockContent: false,
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Fevkalade ",
    status: "minted",
    category: ["araba", "sanat"],
    imageUrls: [
      "nfts/images/2051-1.jpg",
      "nfts/images/2051-2.jpg",
      "nfts/images/2051-3.jpg",
      "nfts/images/2051-4.jpg",
      "nfts/images/2051-5.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-02-21T21:53:44.856Z",
    tokenId: 2051,
    mintTxHash: "0x353424ada961a1371a71d53ca85ca1c353917fcfe7b03a14f57ce1af1c354e03",
    totalVotes: {
      for: 6
    },
    plansDetails: [],
    mintername: "destan",
    minterDisplayName: "Destanᕫ",
    minterAvatarUrl: "statics/avatars/0x32f35c75c770cf17271bbe439131c5ce61ffadf0.png",
    minterAboutMe:
      "Blockchain teknolojisini kullanan ve blockchainin sınırlarını zorlayan bir web3 topluluğu 💪",
    minterStaked: 0,
    isLiked: false,
    isSaved: false
  },
  {
    name: "test 3",
    chainId: 56,
    minter: "0x06da979225262715ed57449d0573329a1e685140",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "test 3",
    status: "minted",
    category: ["DeHub"],
    imageUrls: [
      "nfts/images/2050-1.jpg",
      "nfts/images/2050-2.jpg",
      "nfts/images/2050-3.jpg",
      "nfts/images/2050-4.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-02-06T10:11:05.625Z",
    tokenId: 2050,
    mintTxHash: "0x5102625e3405e33aa664f6907c1972b76de426e93fb82a8ae5c4064fe04113f6",
    totalVotes: {
      for: 7
    },
    plansDetails: [],
    mintername: "d",
    minterDisplayName: "DeHub",
    minterAvatarUrl: "statics/avatars/0x06da979225262715ed57449d0573329a1e685140.octet-stream",
    minterAboutMe:
      "The official account of DeHub.\r\n\r\nVerify with the Megalodon Badge of Honour",
    minterStaked: 50000000,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Mario Lemina",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Lemina",
    status: "minted",
    category: ["GALATASARAY"],
    imageUrls: ["nfts/images/2049-1.jpg", "nfts/images/2049-2.jpg", "nfts/images/2049-3.jpg"],
    postType: "feed-images",
    createdAt: "2025-02-05T18:27:51.895Z",
    tokenId: 2049,
    mintTxHash: "0x6b654831a3e9ed5b7bb9f9d9b2d005212ae30d6bfe7547db08db03c495beab5b",
    totalVotes: {
      for: 12
    },
    totalTips: 3,
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "test 2",
    chainId: 56,
    minter: "0x06da979225262715ed57449d0573329a1e685140",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "testing",
    status: "minted",
    category: ["Action"],
    imageUrls: ["nfts/images/2047-1.jpg", "nfts/images/2047-2.jpg"],
    postType: "feed-images",
    createdAt: "2025-02-04T15:27:15.458Z",
    tokenId: 2047,
    mintTxHash: "0xe28477a3933757591e5c0d27a0a1a29df98b6fc89aed42ed5dffd5997d8a43c5",
    totalVotes: {
      for: 5
    },
    plansDetails: [],
    mintername: "d",
    minterDisplayName: "DeHub",
    minterAvatarUrl: "statics/avatars/0x06da979225262715ed57449d0573329a1e685140.octet-stream",
    minterAboutMe:
      "The official account of DeHub.\r\n\r\nVerify with the Megalodon Badge of Honour",
    minterStaked: 50000000,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Morata",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Morata",
    status: "minted",
    category: ["GALATASARAY"],
    imageUrls: ["nfts/images/2038-1.jpg", "nfts/images/2038-2.jpg", "nfts/images/2038-3.jpg"],
    postType: "feed-images",
    createdAt: "2025-02-01T21:03:36.996Z",
    tokenId: 2038,
    mintTxHash: "0x25dc708225f2a1ec3bdcae32226257be778b553b7916dbadbbda83aa5a2c4cac",
    totalVotes: {
      for: 10
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Sanat ",
    chainId: 56,
    minter: "0x32f35c75c770cf17271bbe439131c5ce61ffadf0",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Araba ",
    status: "minted",
    category: ["sanat", "araba"],
    imageUrls: [
      "nfts/images/2036-1.jpg",
      "nfts/images/2036-2.jpg",
      "nfts/images/2036-3.jpg",
      "nfts/images/2036-4.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-01-30T18:20:09.704Z",
    tokenId: 2036,
    mintTxHash: "0xbcd5932f272a9a3b5c0ca1c65e6695a8a42898564d2cba88a99b35dfdbb37465",
    totalVotes: {
      for: 10
    },
    plansDetails: [],
    mintername: "destan",
    minterDisplayName: "Destanᕫ",
    minterAvatarUrl: "statics/avatars/0x32f35c75c770cf17271bbe439131c5ce61ffadf0.png",
    minterAboutMe:
      "Blockchain teknolojisini kullanan ve blockchainin sınırlarını zorlayan bir web3 topluluğu 💪",
    minterStaked: 0,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Osimhen",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Victor Osimhen",
    status: "minted",
    category: ["GALATASARAY"],
    imageUrls: [
      "nfts/images/2034-1.jpg",
      "nfts/images/2034-2.jpg",
      "nfts/images/2034-3.jpg",
      "nfts/images/2034-4.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-01-30T13:21:49.097Z",
    tokenId: 2034,
    mintTxHash: "0x7e26a9eedbfa33ea5328b83ae608dfeb5ca09acc620d1fde8276d3a8ca1eecb8",
    totalVotes: {
      for: 13
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Gabriel Sara",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Gabriel Sara",
    status: "minted",
    category: ["Sport"],
    imageUrls: ["nfts/images/2033-1.jpg", "nfts/images/2033-2.jpg"],
    postType: "feed-images",
    createdAt: "2025-01-30T13:05:38.398Z",
    tokenId: 2033,
    mintTxHash: "0x22fc719776c3576ad1f893fbc5a95b34bc7ab240158a34847ea70c248f46449e",
    totalVotes: {
      for: 12
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Dehub'ın Doğuşu 🌱",
    chainId: 56,
    minter: "0xff3c607a5ae4b9b4f96801f32e73c3bbe8456a84",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Dehub ✊🏻",
    status: "minted",
    category: ["Action", "Blockchain ", "Documentary"],
    imageUrls: ["nfts/images/2032-1.jpg"],
    postType: "feed-images",
    createdAt: "2025-01-29T21:20:03.949Z",
    tokenId: 2032,
    mintTxHash: "0x4187f231f11988f03e4c636d8f550b5362786130a2081977b319fe33e4c961b6",
    totalVotes: {
      for: 7
    },
    isHidden: false,
    plansDetails: [],
    mintername: "araf",
    minterDisplayName: "Araf",
    minterAvatarUrl: "statics/avatars/0xff3c607a5ae4b9b4f96801f32e73c3bbe8456a84.jpeg",
    minterAboutMe: null,
    minterStaked: 0,
    isLiked: false,
    isSaved: false
  },
  {
    name: "test 1",
    chainId: 8453,
    minter: "0x06da979225262715ed57449d0573329a1e685140",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "abc",
    status: "minted",
    category: ["Action"],
    imageUrls: [
      "nfts/images/2031-1.jpg",
      "nfts/images/2031-2.jpg",
      "nfts/images/2031-3.jpg",
      "nfts/images/2031-4.jpg"
    ],
    postType: "feed-images",
    createdAt: "2025-01-29T08:41:01.332Z",
    tokenId: 2031,
    mintTxHash: "0xae8177b621afc873399b4427207d2a3f2e010111480d37ecf8cb92376b138928",
    totalVotes: {
      for: 4
    },
    plansDetails: [],
    mintername: "d",
    minterDisplayName: "DeHub",
    minterAvatarUrl: "statics/avatars/0x06da979225262715ed57449d0573329a1e685140.octet-stream",
    minterAboutMe:
      "The official account of DeHub.\r\n\r\nVerify with the Megalodon Badge of Honour",
    minterStaked: 50000000,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Galatasaray ",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Mauro İcardi",
    status: "minted",
    category: ["Sport"],
    imageUrls: ["nfts/images/2025-1.jpg"],
    postType: "feed-images",
    createdAt: "2025-01-24T21:00:20.159Z",
    tokenId: 2025,
    mintTxHash: "0x9f2c1ab0c1e317461b3f81cc854fcb81ad095fa4d43ed6372cf3dcaf25285497",
    totalVotes: {
      for: 12
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  },
  {
    name: "Galatasaray ",
    chainId: 8453,
    minter: "0xa70c1e6d264b85413f907fec3690f5cfc313bb6f",
    streamInfo: {
      addBountyFirstXViewers: 0,
      addBountyFirstXComments: 0
    },
    description: "Mauro İcardi",
    status: "minted",
    category: ["Sport"],
    imageUrls: ["nfts/images/2024-1.jpg"],
    postType: "feed-images",
    createdAt: "2025-01-24T20:58:08.172Z",
    tokenId: 2024,
    mintTxHash: "0x914b0d13c546fcd7f485cf27c2d07f22d962d47882369defca30054b27000602",
    totalVotes: {
      for: 12
    },
    plansDetails: [],
    mintername: "galatasaray",
    minterDisplayName: "Galatasaray",
    minterAvatarUrl: "avatars/0xa70c1e6d264b85413f907fec3690f5cfc313bb6f.jpg",
    minterAboutMe: null,
    isLiked: false,
    isSaved: false
  }
];
