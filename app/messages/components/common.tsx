import { useMessage } from "./provider";

export function NoConversation() {
  const { selectedMessage: message } = useMessage("NoConversation");
  if (message) return null;
  return (
    <div className="grid w-full place-items-center">
      <span className="text-center text-lg text-gray-400">Select conversation from left</span>
    </div>
  );
}

export function StartNewConversation() {
  const { selectedMessage: message, messages } = useMessage("StartNewConversation");
  if (!message) return null;
  if (messages.length > 0) return null;
  return (
    <span className="text-lg text-gray-400">
      Start conversation with {message.name} by sending a message
    </span>
  );
}
