"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllPersonsYouFollow } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { ReelPopover } from "./ReelPopover";
import { BiSolidMessageRounded } from "react-icons/bi";
import { ReelComments } from "./ReelComments";
import { UploadReels } from "../components/UploadReels";

export function CarouselOrientation() {
  const { user } = useUser();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [followings, setFollowings] = useState<User_with_interests_location_reason[]>([]);

  useEffect(() => {
    async function fetchFollowings() {
      const followings: User_with_interests_location_reason[] = await getAllPersonsYouFollow(user?.id);
      setFollowings(followings);

      const totalVideos = followings?.reduce((count, following) => count + (following.video_posts?.length || 0), 0);
      setLiked(Array(totalVideos).fill(false));
    }
    fetchFollowings();
  }, [user?.id]);

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
  }, [followings]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleLike = async(index: number,following: User_with_interests_location_reason,postUrl: string) => {
    console.log(postUrl);
    const response = await fetch("/api/frame_video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl: postUrl,
      }),
    });
    const data = await response.json();
    console.log(data);
    setLiked((prevLiked) => {
      const newLiked = [...prevLiked];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
  };

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

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-md bg-black border-none relative"
    >
      <CarouselContent className="-mt-1 h-screen border-none bg-black">
        {followings?.map((following, followingIndex) =>
          following.video_posts?.map((post, postIndex) => {
            const videoIndex = following.video_posts?.slice(0, postIndex).reduce((acc, vp) => acc + (vp ? 1 : 0), 0) ?? 0;
            return (
              <CarouselItem key={postIndex} className="h-full">
                <Card className="h-full bg-black border-none relative">
                  <CardContent className="bg-black relative">
                    <video
                      ref={(el) => {
                        videoRefs.current[videoIndex] = el;
                      }}
                      className="h-full w-full rounded-lg"
                      src={post.url}
                      playsInline
                      loop
                      controls={false}
                      onClick={handleVideoClick}
                    ></video>
                    <IoIosHeart
                      onClick={() => toggleLike(videoIndex, following, post.url)} // Correctly formatted function call
                        className={`absolute right-[17px] sm:right-[-18px] top-1/2 transform -translate-y-1/2 mr-4 ${
                          liked[videoIndex] ? 'text-red-500' : 'text-white'
                        }`}
                        size={25}
                    />
                    <ReelComments videoId={post.video_id} following={following} />
                    <div className="absolute bottom-[60px] right-[35px] sm:right-[0px] ">
                      <ReelPopover following={following} videoId={post.video_id}/>
                    </div>
                    <p className="absolute bottom-[-1] left-5 text-white p-2 rounded-md font-serif">{post.title}•{timeAgo(String(post.createdAt))}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })
        )}
      </CarouselContent>
      <div className="absolute lg:-left-1/3 lg:top-1/2 md:-left-1/4 md:top-1/2 top-0 -right-2 ">
        <UploadReels />
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
