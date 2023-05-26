import axios from "axios";

export async function getMessages(senderId: string, receiverId: string) {
  const { data } = await axios.get(
    "/api/message?senderId=" + senderId + "&receiverId=" + receiverId
  );
  return data;
}

export async function sendMessage(senderId: string, receiverId: string, text: string) {
  return await axios.post("/api/message", {
    senderId,
    receiverId,
    text,
  });
}
