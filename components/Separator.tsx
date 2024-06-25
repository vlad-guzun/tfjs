"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { Cog, SendHorizontal, Settings, User, UserMinus, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "../hooks/useStore"; // Update the import path as necessary
import { addUserToInbox } from "@/lib/actions/user.action"; // Update the import path as necessary

export function SeparatorForProfile({ userProfile }: { userProfile: User_with_interests_location_reason }) {
  const [followStatus, setFollowStatus] = useState<string>("");
  const { user } = useUser();
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const router = useRouter();

  useEffect(() => {
    setFollowStatus(getFollowStatus());
  }, [userProfile]);

  const getFollowStatus = (): string => {
    if (userProfile && userProfile.clerkId && user) {
      const followStatusFromCookie = Cookies.get(`followStatus_${user.id}_${userProfile.clerkId}`);
      return followStatusFromCookie ? followStatusFromCookie : "follow";
    }
    return "";
  };

  const handleFollow = async () => {
    const response = await fetch("/api/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: user?.id, 
        user_to_follow: userProfile.clerkId, 
      }),
    });

    if (response.ok) {
      Cookies.set(`followStatus_${user?.id}_${userProfile.clerkId}`, "unfollow", { expires: 365 });
      setFollowStatus("unfollow");
    } else {
      console.log("Error following user");
    }
  };

  const handleUnfollow = async () => {
    const response = await fetch("/api/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: user?.id, 
        user_to_follow: userProfile.clerkId, 
      }),
    });

    if (response.ok) {
      Cookies.set(`followStatus_${user?.id}_${userProfile.clerkId}`, "follow", { expires: 365 });
      setFollowStatus("follow");
    } else {
      console.log("Error unfollowing user");
    }
  };

  const handleSendMessage = async () => {
    if (user) {
      await addUserToInbox(user.id, userProfile.clerkId);
      setSelectedUser(userProfile);
      router.push("/inbox");
    }
  };

  return (
    <div className="flex flex-col items-center mt-56 mx-24">
      <div className="w-70p space-y-1">
        <div className="flex flex-col items-center justify-center gap-3">
          <Image src={userProfile?.photo} width={200} height={200} alt={"img"} className="rounded-full" />
          <h4 className="text-lg text-white font-medium leading-none">{userProfile?.username}</h4>
        </div>
      </div>
      <Separator className="my-4 w-70p border border-slate-800" />
      <div className="w-70p flex justify-center items-center space-x-4 text-sm text-white">
        <div className="text-slate-400">{`${userProfile?.firstName} ${userProfile?.lastName}`}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{userProfile?.location}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{userProfile?.interests}</div>
      </div>
      <div className="flex gap-4 items-center justify-center">
        {followStatus === "follow" ? (
          <Button onClick={handleFollow} className="text-white bg-black hover:text-black hover:bg-white mt-3 border border-slate-800">
            <UserPlus />
          </Button>
        ) : (
          <Button onClick={handleUnfollow} className="text-white bg-black hover:text-black hover:bg-white mt-3">
            <UserMinus />
          </Button>
        )}
        <Button className="mt-3 text-white bg-black hover:bg-white hover:text-black" onClick={handleSendMessage}>
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
