import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
import Image from "next/image";

import ChatRoom from "@/components/ChatRoom";
import { prisma } from "@/server/db/client";
import { useState } from "react";

export default function Home({ users }) {
  const { data: session } = useSession();
  const [receiver, setReceiver] = useState(null);
  if (session) {
    return (
      <>
        <div className="flex items-center justify-end fixed top-0 w-screen right-0">
          Signed in as {session.user?.email} <br />
          <button
            className="bg-orange-600 py-2 px-6 m-3 rounded text-white"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>

        <div className="h-screen w-screen flex items-center justify-center">
          {receiver ? <ChatRoom sender={session.user} receiver={receiver} /> : "Nothing to show"}
        </div>
        <aside className="fixed left-0 top-0 h-screen border-r border-grey">
          <ul className="divide-y">
            {users.map((user) => (
              <li
                key={user.id}
                className="transition-all flex items-center p-4 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setReceiver(user);
                }}
              >
                <Image
                  className="rounded-full"
                  unoptimized
                  src={user.image || "/images/Defalut-Avatar.jpg"}
                  width={50}
                  height={50}
                  alt={user.name}
                />
                <h2 className="px-2">{user.name}</h2>
              </li>
            ))}
          </ul>
        </aside>
      </>
    );
  }
  return (
    <div className="m-auto flex flex-col items-center justify-center">
      Not signed in <br />
      <button className="bg-orange-600 py-2 px-6 m-3 rounded text-white" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let users = [];
  if (session) {
    let data = await prisma.user.findMany();
    data.map((user) => {
      if (user.id !== session.user?.id) users.push(user);
    });
  } else {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=http://localhost:3000",
        permanent: false,
      },
    };
  }
  console.log(users);
  
  return {
    props: {
      session,
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
