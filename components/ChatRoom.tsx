import axios from "axios";

import { useEffect, useRef } from "react";

export default function ChatRoom({ sender, reciever }) {
  const inputRef = useRef(null);
  useEffect(() => {
    console.log("reciever", reciever);
  }, []);

  async function sendMessage() {
    let payload = null;
    if (inputRef.current) {
      payload = {
        senderId: sender.id,
        receiverId: reciever.id,
        text: inputRef.current.value,
      };
    }
    console.log(payload);
    const { data } = await axios.post("/api/message", payload);
    console.log(data);
  }

  return (
    <div className="w-full h-full p-5">
      {reciever.receivedMessages.map((message) => (
        <span className="ml-[220px] bg-orange-600 p-2 m-3 rounded text-white">
          {message.text}
        </span>
      ))}
      <div className="fixed bottom-0 left-[220px] w-full flex items-start p-4">
        <textarea
          ref={inputRef}
          className="w-1/2 p-2 rounded-lg h-[84px] resize-none"
          rows={1}
          placeholder={`Send a message to ${reciever.name} ...`}
        ></textarea>
        <button className="bg-orange-600 py-2 px-12 mx-3 rounded text-white" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
