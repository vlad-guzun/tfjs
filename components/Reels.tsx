"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllTheFollowingsVideoPosts } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import Image from "next/image";
import { ReelPopover } from "./ReelPopover";

export function CarouselOrientation() {
  const { user } = useUser();
  const [posts, setPosts] = useState<VideoPostProps[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const user_posts = await getAllTheFollowingsVideoPosts(user?.id);
      setPosts(user_posts);
      setLiked(Array(user_posts?.length).fill(false));
    }
    fetchPosts();
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
  }, [posts]);

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
      className="w-full max-w-md bg-black border-none"
    >
      <CarouselContent className="-mt-1 h-screen border-none bg-black">
        {posts?.map((post, index) => (
          <CarouselItem key={index} className="h-full">
            <Card className="h-full bg-black border-none relative">
              <CardContent className="bg-black relative">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="h-full w-full rounded-lg"
                  src={post.url}
                  playsInline
                  loop
                  controls={false}
                  onClick={handleVideoClick}
                ></video>
                <IoIosHeart
                  onClick={() => toggleLike(index)}
                  className={`absolute right-[17px] sm:right-[-18px] top-1/2 transform -translate-y-1/2 mr-4 ${
                    liked[index] ? 'text-red-500' : 'text-white'
                  }`}
                  size={25}
                />
               <div className="absolute bottom-[60px] right-[35px] sm:right-[0px]">
                  <ReelPopover post={post} />
                </div>
                <p className="absolute bottom-[-1] left-5 text-white p-2  rounded-md font-serif">{post.title}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
