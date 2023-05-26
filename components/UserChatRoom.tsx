import { DefaultUser } from "next-auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import IonIcon from "@reacticons/ionicons";
import TextareaAutosize from "react-textarea-autosize";

import { useRef } from "react";

import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { useElementHeight } from "@/hooks/useElementHeight";
import { getMessages, sendMessage } from "@/utils/api";
import { handleKeyPress } from "@/utils/eventHandlers";

import ChatBubble from "./ChatBubble";

export default function ChatRoom({
  sender,
  receiver,
}: {
  sender: DefaultUser & {
    id: string;
  };
  receiver: User;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaWrapperRef, height] = useElementHeight();

  const queryClient = useQueryClient();

  const { data: messages, status: queryStatus } = useQuery(["message", receiver.id], () =>
    getMessages(sender.id, receiver.id)
  );

  const { mutate, status: mutationStatus } = useMutation(
    () =>
      textareaRef.current
        ? sendMessage(sender.id, receiver.id, textareaRef.current.value)
        : Promise.reject(new Error("No message is entered")),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["message", receiver.id]);
      },
    }
  );

  const handleSendMessage = () => {
    if (textareaRef.current) textareaRef.current.value = "";
    mutate();
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center">
      {queryStatus === "loading" || mutationStatus === "loading" ? (
        <span className="m-auto bg-zinc-400/25 py-2 px-6 rounded-full text-zinc-200 ">
          Loading...
        </span>
      ) : (
        <div
          id="messages-wrapper"
          className="flex flex-col-reverse h-full w-full overflow-auto px-5"
          style={{ height: `calc(100% - ${+height + 32}px)` }}
        >
          {messages.map((message: Message) => (
            <ChatBubble message={message} sender={sender} />
          ))}
        </div>
      )}
      <div
        ref={textareaWrapperRef}
        className="bg-zinc-800 absolute bottom-0 left-0 right-0 flex items-center p-[16px]"
      >
        <TextareaAutosize
          maxRows={5}
          ref={textareaRef}
          onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
          placeholder="Wtite a message..."
          className="w-full p-2 rounded-lg resize-none outline-0"
        />
        <button className="flex items-center">
          <IonIcon
            name="send"
            className="text-blue-600 px-4"
            size="large"
            onClick={() => handleSendMessage}
          />
        </button>
      </div>
    </div>
  );
}
