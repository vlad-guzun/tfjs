import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { getAllPersonsYouFollow, getAllVideosById } from "@/lib/actions/user.action";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OptionsReelPopover } from "./OptionsReelPopover";
import NotificationModal from "./NotificationModal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CommandFollowing } from "./CommandFollowing";

export function SeparatorForPersonalProfile({ personalProfile }: { personalProfile: User_with_interests_location_reason }) {
  const [reels, setReels] = useState<VideoPostProps[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [following, setFollowing] = useState<User_with_interests_location_reason[]>([]);

  const fetchReels = async () => {
    const fetchedReels = await getAllVideosById(personalProfile?.clerkId as string);
    setReels(fetchedReels as VideoPostProps[]);
  };

  useEffect(() => {
    fetchReels();
  }, [personalProfile]);

  useEffect(() => {
    const getFollowing = async () => {
      const following = await getAllPersonsYouFollow(personalProfile?.clerkId);
      setFollowing(following);
    };
    getFollowing();
  }, [personalProfile?.clerkId]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleDelete = async (videoId: string) => {
    await fetchReels();
    setNotification("Reel deleted successfully");
  };

  const handleEdit = (videoId: string, newTitle: string) => {
    setReels((prevReels) =>
      prevReels.map((reel) =>
        reel.video_id === videoId ? { ...reel, title: newTitle } : reel
      )
    );
    setNotification("Reel title updated");
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex flex-col items-center mt-56 mx-24">
      <div>
        <div className="w-70p space-y-1">
          <div className="flex flex-col items-center justify-center gap-3">
            <Image src={personalProfile?.photo} width={200} height={200} alt={"img"} className="rounded-full" />
            <h4 className="text-lg text-white font-medium leading-none">{personalProfile?.username}</h4>
          </div>
        </div>
        <Separator className="my-4 w-70p border border-slate-800" />
        <div className="w-70p flex justify-center items-center space-x-4 text-sm text-white">
          <div className="text-slate-400">{`${personalProfile?.firstName} ${personalProfile?.lastName}`}</div>
          <Separator orientation="vertical" className="h-5 border border-slate-700" />
          <div className="text-slate-400">{personalProfile?.location}</div>
          <Separator orientation="vertical" className="h-5 border border-slate-700" />
          <div className="text-slate-400">{personalProfile?.interests}</div>
          <Separator orientation="vertical" className="h-5 border border-slate-700" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="text-slate-400 cursor-pointer">
                Following: {following?.length}
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-96 bg-black text-white border-none shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
              <AlertDialogHeader>
                  {following?.length === 0 ? (
                    <p className="text-sm text-gray-500">You are not following anyone.</p>
                  ) : (
                    <CommandFollowing following={following} />
                  )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Separator orientation="vertical" className="h-5 border border-slate-700" />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4 mb-24">
        {reels?.map((reel) => (
          <div key={reel.video_id} className="relative w-full h-64">
            <video
              src={reel.url}
              className="w-full h-full object-cover rounded-md shadow-lg"
              onClick={handleVideoClick}
              playsInline
              loop
            />
            <div className="absolute top-2 right-2">
              <OptionsReelPopover reel={reel} onDelete={() => handleDelete(reel.video_id)} onEdit={(newTitle) => handleEdit(reel.video_id, newTitle)} />
            </div>
          </div>
        ))}
      </div>
      {notification && <NotificationModal message={notification} onClose={closeNotification} />}
    </div>
  );
}
