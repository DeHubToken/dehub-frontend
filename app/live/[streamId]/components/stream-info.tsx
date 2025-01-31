import Link from "next/link";

export default function BroadcastStreamInfo(props: { stream: any }) {
  const { stream } = props;

  return (
    <div className="mt-5 h-auto w-full rounded-2xl border border-theme-mine-shaft-dark bg-theme-mine-shaft-dark p-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-4 overflow-hidden">
        <h1 className="w-full break-words text-2xl font-medium">{stream.title}</h1>
        <p className="text-sm">
          <span className="font-semibold">Description :</span> {stream?.description}
        </p>
        <div className="flex w-full flex-wrap">
          <span className="mr-1 font-semibold">Categories :</span>
          {stream?.categories?.map((i:any) => (
            <Link key={i} href={`/?category=${i}&type=trends`} className="mr-1">
              <span className="cursor-pointer">#{i}</span>
            </Link>
          ))}
        </div>
        <p className="text-sm">
          <span className="font-semibold">Views :</span> {stream.peakViewers || 0}
        </p>
        {/* <p className="text-sm">
            <span className="font-semibold">Uploaded :</span>{" "}
            {new Date(stream.createdAt).toDateString()}
          </p> */}
      </div>
    </div>
  );
}
