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
      console.log('res', res);
      
      res.status(201).json(post);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
