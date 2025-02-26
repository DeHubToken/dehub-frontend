export default function BroadcastStreamInfo(props: { stream: any }) {
  const { stream } = props;

  return (
    <div className="mt-8 rounded-3xl bg-theme-neutrals-800 p-6">
      <span className="text-xs text-theme-neutrals-400">Description</span>
      <p className="mt-4 text-theme-neutrals-200">{stream?.description}</p>
    </div>
  );
}
