import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="m-auto">
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
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
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=http://localhost:3000",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
