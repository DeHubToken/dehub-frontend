import { StreamStatus } from "@/configs";

type BadgeProps = {
  status: StreamStatus;
  className?: string;
};

const StatusBadge: React.FC<BadgeProps> = ({ status, className }) => {
  const statusStyles: Record<StreamStatus, { color: string; text: string }> = {
    [StreamStatus.OFFLINE]: { color: "bg-gray-500 text-white", text: "OFFLINE" },
    [StreamStatus.LIVE]: { color: "bg-red-600 text-white", text: "LIVE" },
    [StreamStatus.ENDED]: { color: "bg-gray-600 text-white", text: "ENDED" },
    [StreamStatus.SCHEDULED]: { color: "bg-yellow-500 text-black", text: "SCHEDULED" }
  };

  const { color, text } = statusStyles[status];

  return (
    <div
      className={`absolute left-2 top-2 rounded-md px-3 py-1 text-sm font-semibold uppercase ${color} ${className}`}
    >
      {text}
    </div>
  );
};

export default StatusBadge;
