import { prisma } from "@/server/db/client";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      const { text, senderId, receiverId } = req.body;
      const post = await prisma.message.create({
        data: {
          text,
          senderId,
          receiverId,
        },
      });
      res.status(201).json(post);
      break;
    case "GET":
      const { senderId: sId, receiverId: rId } = req.query;
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: sId,
              receiverId: rId,
            },
            {
              senderId: rId,
              receiverId: sId,
            },
          ],
        },
      });
      messages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      res.status(200).json(messages);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
