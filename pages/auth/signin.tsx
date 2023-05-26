import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import IonIcon from "@reacticons/ionicons";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      
      <h2 className="text-gray-100 font-semibold text-2xl">You are not signed in</h2>
      <span className="text-gray-400 p-6 whitespace-nowrap">Continue with</span>

      <ul>
        {Object.values(providers).map((provider) => (
          <li
            className="transition-all m-0 border border-zinc-700 bg-zinc-800 w-[315px] text-white rounded-md hover:bg-zinc-700 hover:border-zinc-600"
            key={provider.name}
          >
            <button
              className="w-full h-full flex items-center justify-center p-3"
              onClick={() => signIn(provider.id)}
            >
              <IonIcon size="large" name="logo-github" />
              <span className="px-3">{provider.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/" } };
  }

  // Get the available providers that are configured in NextAuth
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
