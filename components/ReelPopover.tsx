import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllVideosById } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { PersonReels } from "./PersonReels";

interface UserWithInterestsLocationReason {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  interests: string;
  location: string;
  reasonForJoining: string;
  following?: string[];
  feedback?: any[];
  text_posts?: any[];
  video_posts?: { url: string; title: string }[];
  lastSeen?: Date;
}

interface ReelPopoverProps {
  following: UserWithInterestsLocationReason;
}

export function ReelPopover({ following }: ReelPopoverProps) {
  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getAllVideosById(following?.clerkId);
      console.log(videos);
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
