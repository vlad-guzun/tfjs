import { Separator } from "@/components/ui/separator";
import { getAllVideosById } from "@/lib/actions/user.action";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OptionsReelPopover } from "./OptionsReelPopover";

export function SeparatorForPersonalProfile({ personalProfile }: { personalProfile: User_with_interests_location_reason }) {
  const [reels, setReels] = useState<VideoPostProps[]>();

  useEffect(() => {
    const getReels = async () => {
      const reels = await getAllVideosById(personalProfile?.clerkId as string);
      setReels(reels as VideoPostProps[]);
    };
    getReels();
  }, [personalProfile]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
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
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4 mb-24">
        {reels?.map((reel) => (
          <div key={reel.title} className="relative w-full h-64">
            <video
              src={reel.url}
              className="w-full h-full object-cover rounded-md shadow-lg"
              onClick={handleVideoClick}
              playsInline
              loop
            />
            <div className="absolute top-2 right-2">
              <OptionsReelPopover reel={reel}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
