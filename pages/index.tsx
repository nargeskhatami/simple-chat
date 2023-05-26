import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { DefaultUser, Session } from "next-auth/core/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

import UserChatRoom from "@/components/UserChatRoom";
import UsersList from "@/components/UsersList";

import { useState } from "react";

import { User } from "@/types/User";
import { prisma } from "@/server/db/client";

export default function Home({ users }: { users: User[] }) {
  const { data: session } = useSession() as { data: Session };
  const [receiver, setReceiver] = useState<User | null>(null);

  return (
    <>
      <UsersList users={users} setReceiver={(user: User) => setReceiver(user)} />
      <div className="h-screen flex items-center justify-center w-[calc(100%-250px)]">
        {receiver ? (
          <UserChatRoom
            sender={
              session.user as DefaultUser & {
                id: string;
              }
            }
            receiver={receiver}
          />
        ) : (
          <span className="bg-zinc-400/25 py-2 px-6 rounded-full text-zinc-200 ">
            Select a chat to start messaging
          </span>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getServerSession(context.req, context.res, authOptions)) as Session;
  let users: User[] = [];
  if (session) {
    let data = await prisma.user.findMany();
    let currentUser: User | null = null;
    data.map((user) => {
      if (user.id !== session.user?.id)
        users.push({
          ...user,
          isCurrentUser: false,
        });
      else
        currentUser = {
          ...user,
          isCurrentUser: true,
        };
    });
    if (currentUser) {
      users.push(currentUser);
      users.reverse();
    }
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
