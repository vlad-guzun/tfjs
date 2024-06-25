import Image from "next/image";
import { Separator } from "./ui/separator";
import { Eye } from "lucide-react";
import { IoMdSend } from "react-icons/io";
import { useUserStore } from "../hooks/useStore"; 
import { addUserToInbox } from "@/lib/actions/user.action"; 
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Followings = ({ followings }: { followings: User_with_interests_location_reason[] }) => {
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const router = useRouter();
  const { user: loggedInUser } = useUser();

  const addToInbox = async (userToAdd: User_with_interests_location_reason) => {
    if (loggedInUser) {
      await addUserToInbox(loggedInUser.id, userToAdd.clerkId);
      setSelectedUser(userToAdd);
      router.push("/inbox");
    }
  };

  const handleProfileClick = (user: User_with_interests_location_reason) => {
    setSelectedUser(user);
    router.push(`/profile/${user.username}`);
  };

  return (
    <div className="text-white mb-[150px]">
      <h1 className="text-center text-3xl font-sans mt-16 text-slate-500">Following</h1>
      {followings?.map((following) => {
        return (
          <div key={following.clerkId} className="flex flex-col items-center mt-56 mx-24">
            <div className="w-70p space-y-1">
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href={`/profile/${following.username}`}>
                  <Image src={following?.photo} width={200} height={200} alt={"img"} className="rounded-full" />
                </Link>
                <h4 className="text-lg text-white font-medium leading-none">{following?.username}</h4>
              </div>
            </div>
            <Separator className="my-4 w-70p border border-slate-800" />
            <div className="w-70p flex justify-center items-center space-x-4 text-sm text-white">
              <div className="text-slate-400">{`${following?.firstName} ${following?.lastName}`}</div>
              <Separator orientation="vertical" className="h-5 border border-slate-700" />
              <div className="text-slate-400">{following?.location}</div>
              <Separator orientation="vertical" className="h-5 border border-slate-700" />
              <div className="text-slate-400">{following?.interests}</div>
              <Separator orientation="vertical" className="h-5 border border-slate-700" />
              <Eye className="hover:text-slate-600 cursor-pointer" onClick={() => handleProfileClick(following)} />
              <IoMdSend color="white" size={15} onClick={() => addToInbox(following)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Followings;
