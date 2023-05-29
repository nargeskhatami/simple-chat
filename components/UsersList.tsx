import { User } from "@/types/User";
import { signOut } from "next-auth/react";
import Image from "next/image";

type Props = {
  users: User[];
  setReceiver: Function;
};

export default function UsersList(props: Props) {
  const { users, setReceiver } = props;
  
  return (
    <>
      <aside className="bg-zinc-800 w-[250px] fixed left-0 top-0 h-screen border-r border-zinc-700">
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`${
                user.isCurrentUser
                  ? "border-b border-zinc-700 relative"
                  : " cursor-pointer hover:bg-zinc-700"
              } transition-all flex flex-col items-center p-4`}
              onClick={() => setReceiver(user)}
            >
              <div className="flex items-center">
                <Image
                  className="rounded-full"
                  unoptimized
                  src={user.image || "/images/Defalut-Avatar.jpg"}
                  width={50}
                  height={50}
                  alt={user.name || "User Avatar"}
                />
                <div>
                  <h2 className="px-2 text-zinc-100 font-semibold">{user.name}</h2>
                  <span className="block px-2 text-sm text-ellipsis overflow-hidden w-[180px] text-zinc-400">
                    {user.email}
                  </span>
                </div>
              </div>
              {user.isCurrentUser && (
                <button
                  className="transition-all bg-zinc-700 hover:bg-zinc-600 py-2 px-6 w-full mt-3 rounded text-white block text-sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
