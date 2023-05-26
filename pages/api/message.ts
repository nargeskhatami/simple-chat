import { prisma } from "@/server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "POST":
      const { text, senderId, receiverId } = req.body;
      // create a new message
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
      const { senderI: sId, receiverId: rId } = req.query;
      // find all messages between two users
      let messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: sId as string,
              receiverId: rId as string,
            },
            {
              senderId: rId as string,
              receiverId: sId as string,
            },
          ],
        },
      });
      messages.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      const result = messages.map((message) => {
        return {
          ...message,
          // convert date format to 'HH:mm' format
          createdAt: new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(message.createdAt)),
        };
      });
      res.status(200).json(result);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
