export default function BroadcastChatPanel(props: { streamId: string }) {
    const { streamId } = props;
  
    return (
      <div className="w-full xl:w-[25%] p-4 bg-gray-900" style={{ aspectRatio: "9/16" }}>
        <h2 className="text-lg font-bold">Live Chat</h2>
        <p>{streamId}</p>
      </div>
    );
  }