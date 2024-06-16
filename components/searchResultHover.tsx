import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";
  import { getAllVideosById } from "@/lib/actions/user.action";
  import Image from "next/image";
  import { useEffect, useState } from "react";
  import { SearchCarousel } from "./SearchCarousel";
  import Link from "next/link";
  import { FcDislike } from "react-icons/fc";

  
  export function SearchResultHover({ search }: { search: User_with_interests_location_reason }) {
    const [reels, setReels] = useState<VideoPostProps[]>([]);
  
    useEffect(() => {
      const fetchVideos = async () => {
        const reels = await getAllVideosById(search.clerkId);
        setReels(reels);
      };
      fetchVideos();
    }, [search.clerkId]);
  
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={`/profile/${search.username}`}>
            <div className="flex gap-1 py-2 pl-1">
              <Image src={search.photo} height={30} width={30} alt={search.firstName} className="rounded-full" />
              <span className="text-white">{search.username}</span>
            </div>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="bg-black border border-none ml-1 h-[300px] w-[200px] shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
          <div className="flex items-center justify-center h-full">
            {reels.length === 0 ? (
              <div className="flex flex-col items-center">
                <span className="text-white">no posts</span>
                <FcDislike size={40}/>

              </div>
            ) : (
              <SearchCarousel reels={reels} />
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }
  