"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllTheUsers } from "@/lib/actions/post.action";
import { useEffect, useRef, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { ReelCommentsStart } from "./ReelCommentsStart";
import { ReelPopoverStart } from "./ReelPopoverStart";
import useActiveList from "@/hooks/useActiveList";
import { UploadReel } from "./UploadReel";
import { Plus } from "lucide-react";

const timeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
    { name: 'w', seconds: 604800 },
    { name: 'd', seconds: 86400 },
    { name: 'h', seconds: 3600 },
    { name: 'm', seconds: 60 },
    { name: 's', seconds: 1 },
  ];

  for (const unit of units) {
    const quotient = Math.floor(diffInSeconds / unit.seconds);
    if (quotient > 0) {
      return `${quotient}${unit.name}`;
    }
  }

  return 'just now';
};

export function StartReels() {
  const [users, setUsers] = useState<User_with_interests_location_reason[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const { members } = useActiveList();

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllTheUsers();
      setUsers(users);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [users]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleLike = (index: number) => {
    setLiked((prevLiked) => {
      const newLiked = [...prevLiked];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
  };
  console.log(members);

  return (
    <div className="relative">
      <div className="fixed lg:left-1/4 lg:ml-2 top-1/2 transform -translate-y-1/2 z-10">
        <UploadReel />
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-md"
      >
        <CarouselContent className="-mt-1 h-[730px]">
          {users?.map((user) => {
            return user.video_posts?.map((reel, index) => (
              <CarouselItem key={reel.video_id} className="pb-12">
                <div className="h-full relative">
                  <Card className="h-full bg-black border-none">
                    <CardContent className="h-full flex items-center justify-center relative">
                      <div className="w-[360px] h-[640px]">
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          className="w-full h-full object-cover shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] rounded-md"
                          src={reel.url}
                          playsInline
                          loop
                          controls={false}
                          onClick={handleVideoClick}
                        ></video>
                        <p className="font-serif text-md mt-1 text-white">
                          {reel.title} • {timeAgo(String(reel.createdAt))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="absolute top-1/2 md:right-0 right-14 transform -translate-y-1/2">
                    <IoIosHeart
                      onClick={() => toggleLike(index)}
                      className={`cursor-pointer ${
                        liked[index] ? 'text-red-500' : 'text-white'
                      }`}
                      size={25}
                    />
                    <div className="mt-6">
                      <ReelCommentsStart videoId={reel.video_id} following={user} />
                    </div>
                  </div>
                  <div className="absolute bottom-[55px] lg:right-2 sm:right-[0px] right-[51px]">
                    <ReelPopoverStart following={user} videoId={reel.video_id} />
                  </div>
                  
                </div>
              </CarouselItem>
            ));
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
