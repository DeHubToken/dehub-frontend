export default function BroadcastActionPanel(props: { streamId: string }) {
    const { streamId } = props;
  
    return (
      <div className="mt-3 h-auto w-full">
        <div className="flex h-auto w-full items-start justify-start gap-4">
            <p>Tip {streamId}</p>
            <p>Follow</p>
          {/* <TipModal streamId={streamId} />
          <FollowButton streamId={streamId} /> */}
        </div>
      </div>
    );
  }