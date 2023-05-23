import axios from "axios";

import { useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

async function getUserMessages(senderId, receiverId) {
  const { data } = await axios.get(
    "/api/message?senderId=" + senderId + "&receiverId=" + receiverId
  );
  console.log("da", data);

  return data;
}

async function sendMessage(senderId, receiverId, text) {
  return await axios.post("/api/message", {
    senderId,
    receiverId,
    text,
  });
}

export default function ChatRoom({ sender, receiver }) {
  const inputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: messages, status } = useQuery(["message", receiver.id], () =>
    getUserMessages(sender.id, receiver.id)
  );

  const { mutate, status: status2 } = useMutation(
    (data) => sendMessage(data.senderId, data.receiverId, data.text),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["message", receiver.id]);
      },
    }
  );

  return (
    <div className="w-full h-full p-5">
      {status === "loading" || status2 === "loading" ? (
        <div>Loading...</div>
      ) : (
        <div className="ml-[220px] flex flex-col">
          {messages.map((message) => (
            <span
              className={`${
                message.senderId === sender.id ? "bg-blue-500 ml-auto" : "bg-orange-600"
              } p-2 my-3 rounded text-white w-fit`}
            >
              {message.text}
            </span>
          ))}
        </div>
      )}
      <div className="fixed bottom-0 left-[220px] w-full flex items-start p-4">
        <textarea
          ref={inputRef}
          className="w-1/2 p-2 rounded-lg h-[84px] resize-none"
          rows={1}
          placeholder={`Send a message to ${receiver.name} ...`}
        ></textarea>
        <button
          className="bg-orange-600 py-2 px-12 mx-3 rounded text-white"
          onClick={() => {
            if (inputRef.current)
              mutate({
                senderId: sender.id,
                receiverId: receiver.id,
                text: inputRef.current.value,
              });
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
