import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllVideosById } from "@/lib/actions/user.action";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PersonReels } from "./PersonReels";
import useActiveList from "@/hooks/useActiveList";

export function ReelPopover({ following, videoId }: { following: User_with_interests_location_reason, videoId: string }) {
  const { members } = useActiveList();
  const [videos, setVideos] = useState<VideoPostProps[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getAllVideosById(following?.clerkId);
      setVideos(videos);
    };
    fetchVideos();
  }, [following?.clerkId]);

  const isUserActive = members.indexOf(following?.clerkId) !== -1;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative border-none bg-black hover:bg-black">
          <Image className="rounded-full" src={following?.photo} height={20} width={20} alt="photo" />
          {isUserActive && (
            <div className="absolute top-2 right-0 w-2 h-2 bg-green-500 rounded-full pulse"></div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 h-[480px] bg-black border border-slate-800 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
        <PersonReels following={{ ...following, video_posts: videos }} />
      </PopoverContent>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .pulse {
          animation: pulse 0.8s infinite;
        }
      `}</style>
    </Popover>
  );
}
