import { DefaultUser } from "next-auth";

import { Message } from "@/types/Message";

export default function ChatBubble({
  message,
  sender,
}: {
  message: Message;
  sender: DefaultUser & {
    id: string;
  };
}) {
  return (
    <div
      className={`${
        message.senderId === sender.id
          ? "bg-blue-500 ml-auto rounded-br-none"
          : " rounded-bl-none bg-orange-600"
      } py-2 px-4 my-3 rounded-lg text-white w-fit`}
    >
      {message.text}
      <div className="pt-1 text-xs text-white/70">{message.createdAt}</div>
    </div>
  );
}
