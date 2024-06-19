import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Image from "next/image";
import { IoMdSend } from "react-icons/io";
import { useUserStore } from "../store/userStore";
import { addUserToInbox } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";

export function CommandFollowing({ following }: { following: User_with_interests_location_reason[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const router = useRouter();
  const { user } = useUser();

  const filteredFollowing = following?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToInbox = async (userToAdd: User_with_interests_location_reason) => {
    await addUserToInbox(user?.id, userToAdd?.clerkId);
    setSelectedUser(userToAdd);
    router.push("/inbox");
  };

  return (
    <Command className="rounded-lg shadow-md h-full border-none bg-black text-white border-b border-b-slate-700">
      <CommandInput
        placeholder="search"
        value={searchTerm}
        onValueChange={setSearchTerm}
        className="font-serif text-2xl hover:bg-black"
      />
      <CommandList className="max-h-[50vh] overflow-y-auto custom-scrollbar">
        <CommandEmpty className="font-serif text-2xl">No results found.</CommandEmpty>
        <CommandGroup heading="following" className="font-serif text-2xl bg-black">
          {filteredFollowing.map((user) => (
            <div key={user.clerkId}>
              <CommandItem className="py-3 flex justify-between">
                <div className="flex items-center justify-center gap-3 text-serif">
                  <Image src={user.photo} width={50} height={50} alt={user.username} className="rounded-full" />
                  <span className="ml-2 text-white">{user.username}</span>
                </div>
                <IoMdSend color="white" size={15} onClick={() => addToInbox(user)} />
              </CommandItem>
            </div>
          ))}
        </CommandGroup>
      </CommandList>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f1f1f;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </Command>
  );
}
