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



export function StartReels() {
  const [users, setUsers] = useState<User_with_interests_location_reason[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);

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

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-md"
    >
      <CarouselContent className="-mt-1 h-[730px]">
        {users?.map((user) =>
          user.video_posts?.map((reel, index) => (
            <CarouselItem key={reel.video_id} className="pt-1 md:basis-1/2">
              <div className="p-10 h-full my-5 relative">
                <Card className="h-full bg-black border-none ">
                  <CardContent className="h-full flex items-center justify-center px-8 relative">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="h-full w-full object-cover shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] rounded-md"
                      src={reel.url}
                      playsInline
                      loop
                      controls={false}
                      onClick={handleVideoClick}
                    ></video>
                  </CardContent>
                </Card>
                <div className="absolute top-1/2 right-0 ">
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
                <div className="absolute bottom-[60px] right-[35px] sm:right-[0px] ">
                      <ReelPopoverStart following={user} videoId={reel.video_id}/>
                </div>
               <p className="font-serif text-md absolute ml-8 text-white mb-4">{reel.title}</p>
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
