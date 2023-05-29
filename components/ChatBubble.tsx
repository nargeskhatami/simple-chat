import { DefaultUser } from "next-auth";

import { Message } from "@/types/Message";

type Props = {
  message: Message;
  sender: DefaultUser & {
    id: string;
  };
};

export default function ChatBubble(props: Props) {
  const { message, sender } = props;

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
