import { ListFilter } from "lucide-react";

import { LazyImage } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const videosTableHeader: string[] = ["Date", "Views", "Likes", "Status", "Aciton"];

// TODO: Replace with real data
const data = [
  {
    id: 1,
    title: "Video 1",
    description: "Description 1",
    date: "2025-02-04",
    thumbnail: "https://placehold.co/160x90",
    views: 0,
    likes: 0,
    status: "Draft",
    isPrivate: true
  },
  {
    id: 2,
    title: "Video 2",
    description: "Description 2",
    date: "2025-02-05",
    thumbnail: "https://placehold.co/160x90",
    views: 0,
    likes: 0,
    status: "Draft",
    isPrivate: true
  },
  {
    id: 3,
    title: "Video 3",
    description: "Description 3",
    thumbnail: "https://placehold.co/160x90",
    date: "2025-02-06",
    views: 0,
    likes: 0,
    status: "Draft",
    isPrivate: true
  },
  {
    id: 4,
    title: "Video 4",
    description: "Description 4",
    thumbnail: "https://placehold.co/160x90",
    date: "2025-02-07",
    views: 0,
    likes: 0,
    status: "Draft",
    isPrivate: true
  }
];

export default function Page() {
  return (
    <div className="w-full px-6">
      <div className="flex items-center px-2 py-6">
        <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
          My uploads
        </h1>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="justify-start">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>
          <Button className="gap-2 rounded-full">
            Filter
            <ListFilter className="size-3 text-zinc-400" />
          </Button>
        </div>
        <TabsContent value="videos" className="mt-6">
          <VideosPanel videos={data} />
        </TabsContent>
        <TabsContent value="snippets" className="mt-6">
          <SnippetsPanel videos={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type VideosPanelProps = {
  videos: {
    id: number;
    title: string;
    description: string;
    date: string;
    views: number;
    likes: number;
    status: string;
    isPrivate: boolean;
    thumbnail: string;
  }[];
};

function VideosPanel(props: VideosPanelProps) {
  const { videos } = props;
  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-6 self-stretch rounded-[10px] px-4">
        <div className="flex flex-[50%] items-center justify-start gap-2.5">
          <h1 className="text-xs font-semibold leading-none text-theme-neutrals-400">Videos</h1>
        </div>
        {videosTableHeader.map((header) => (
          <div key={header} className="flex flex-1 items-center justify-start gap-2.5">
            <span className="text-xs font-semibold leading-none text-theme-neutrals-400">
              {header}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center justify-start gap-6 self-stretch rounded-3xl p-4 outline outline-1 outline-offset-[-1px] outline-theme-neutrals-800"
          >
            <div className="flex flex-[50%] items-start justify-start gap-6 self-stretch overflow-hidden py-2">
              <div className="relative h-24 w-40 overflow-hidden rounded-lg bg-theme-neutrals-700">
                <LazyImage
                  className="size-full object-cover"
                  src={video.thumbnail}
                  alt={video.title}
                />
              </div>
              <div className="flex items-center justify-start gap-3">
                <div className="flex flex-col items-start justify-start gap-1">
                  <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                    {video.title}
                  </span>
                  <span className="justify-start text-xs font-normal leading-none text-theme-neutrals-400">
                    {video.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.date}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.views}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.likes}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start gap-4 self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.status}
              </span>
              <div className="justify-start text-xs font-semibold leading-none text-theme-neutrals-400">
                {video.isPrivate ? "Private" : "Public"}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <Button className="rounded-full text-theme-neutrals-400">Edit Draft</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SnippetsPanel(props: VideosPanelProps) {
  const { videos } = props;
  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-6 self-stretch rounded-[10px] px-4">
        <div className="flex flex-[50%] items-center justify-start gap-2.5">
          <h1 className="text-xs font-semibold leading-none text-theme-neutrals-400">Snippets</h1>
        </div>
        {videosTableHeader.map((header) => (
          <div key={header} className="flex flex-1 items-center justify-start gap-2.5">
            <span className="text-xs font-semibold leading-none text-theme-neutrals-400">
              {header}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center justify-start gap-6 self-stretch rounded-3xl p-4 outline outline-1 outline-offset-[-1px] outline-theme-neutrals-800"
          >
            <div className="flex flex-[50%] items-start justify-start gap-6 self-stretch overflow-hidden py-2">
              <div className="relative h-[160px] w-24 overflow-hidden rounded-lg bg-theme-neutrals-700">
                <LazyImage
                  className="size-full object-cover"
                  src={video.thumbnail}
                  alt={video.title}
                />
              </div>
              <div className="flex items-center justify-start gap-3">
                <div className="flex flex-col items-start justify-start gap-1">
                  <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                    {video.title}
                  </span>
                  <span className="justify-start text-xs font-normal leading-none text-theme-neutrals-400">
                    {video.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.date}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.views}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.likes}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start gap-4 self-stretch overflow-hidden py-2">
              <span className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                {video.status}
              </span>
              <div className="justify-start text-xs font-semibold leading-none text-theme-neutrals-400">
                {video.isPrivate ? "Private" : "Public"}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start self-stretch overflow-hidden py-2">
              <Button className="rounded-full text-theme-neutrals-400">Edit Draft</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
