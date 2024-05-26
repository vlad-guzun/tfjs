import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllVideosById } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { PersonReels } from "./PersonReels";





export function ReelPopover({ following,videoId }: {following: User_with_interests_location_reason,videoId:string}) {
  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getAllVideosById(following?.clerkId);
      console.log(videos);
      console.log(videoId);
    };
    fetchVideos();
  }, [following?.clerkId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-none bg-black hover:bg-black">
          <Image className="rounded-full" src={following?.photo} height={20} width={20} alt="photo" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 h-[480px] bg-black border border-slate-800">
        <PersonReels following={following} />
      </PopoverContent>
    </Popover>
  );
}
