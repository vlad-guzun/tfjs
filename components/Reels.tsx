"use client";

require("@tensorflow/tfjs");
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllPersonsYouFollow, getAllReels } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { ReelPopover } from "./ReelPopover";
import { BiSolidMessageRounded } from "react-icons/bi";
import { ReelComments } from "./ReelComments";
import { UploadReels } from "../components/UploadReels";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs";
import { ReelSkeleton } from "./ReelSkeleton";
import { ProgressReel } from "./ProgressBarReel";
import {  recommend_reels, save_embedded_reels } from "@/lib/actions/generate.similar.people";

export function CarouselOrientation() {
  const { user } = useUser();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [followings, setFollowings] = useState<User_with_interests_location_reason[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [useModel, setUseModel] = useState<use.UniversalSentenceEncoder | null>(null);
  const [processedData, setProcessedData] = useState<{ videoId: string; description: string; embedding: number[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setupBackend() {
      await tf.setBackend("webgl");
      await tf.ready();
      console.log("TensorFlow backend setup complete");
    }
    setupBackend();
  }, []);

  useEffect(() => {
    async function loadModels() {
      const mobilenetModel = await mobilenet.load();
      const useModel = await use.load();
      setModel(mobilenetModel);
      setUseModel(useModel);
      console.log("Models loaded");
    }
    loadModels();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const followings: User_with_interests_location_reason[] = await getAllPersonsYouFollow(user?.id);
      setFollowings(followings);

      const totalVideos = followings?.reduce((count, following) => count + (following.video_posts?.length || 0), 0);
      setLiked(Array(totalVideos).fill(false));

      const reels = await getAllReels();
      setReels(reels);

      setLoading(false);
      console.log("Data fetched", followings, reels);
    }

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const classifyImage = async (model: mobilenet.MobileNet, imageUrl: string) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const predictions = await model.classify(img);
      return predictions[0].className;
    } catch (error) {
      console.error("Error classifying image:", error);
      throw error;
    }
  };

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleLike = async (index: number, url: string) => {
    console.log("Toggle like triggered for:", url);

    if (model && useModel) {
      try {
        console.log("Fetching screenshots for URL:", url);
        const response = await fetch("/api/generate-screenshot2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();
        const screenshots = data.data.screenshots;
        console.log("Screenshots received:", screenshots);

        const classifications = await Promise.all(
          screenshots.map(async (screenshotUrl: string) => {
            return await classifyImage(model, screenshotUrl);
          })
        );

        console.log("Classifications:", classifications);

        const uniqueClassifications = Array.from(new Set(classifications)).join(", ");
        const embedding = await useModel.embed([uniqueClassifications]);
        const embeddingArray = embedding.arraySync()[0];

        console.log("Embedding array:", embeddingArray);

        const newProcessedData = { videoId: url, description: uniqueClassifications, embedding: embeddingArray };
        console.log("Save result:", newProcessedData);

        const reels_ids = await recommend_reels(embeddingArray);
        console.log(reels_ids);
      } catch (error) {
        console.error("Error during classification and embedding:", error);
      }
    } else {
      console.log("Model or useModel not loaded yet");
    }

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
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-md bg-black border-none relative"
      >
        <CarouselContent className="-mt-1 h-screen border-none bg-black">
          {loading && Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="h-full">
              <Card className="h-full bg-black border-none relative">
                <CardContent className="bg-black relative">
                  <ReelSkeleton />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          {!loading && followings?.map((following, followingIndex) => {
            if (!following.video_posts || following.video_posts.length === 0) return null;
            const post = following.video_posts[0]; // Select only the first video post
            const videoIndex = followingIndex;
            return (
              <CarouselItem key={post.video_id} className="h-full">
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
                      onClick={() => toggleLike(videoIndex, post.url)}
                      className={`absolute right-[17px] sm:right-[-18px] top-1/2 transform -translate-y-1/2 mr-4 ${
                        liked[videoIndex] ? 'text-red-500' : 'text-white'
                      }`}
                      size={25}
                    />
                    <ReelComments videoId={post.video_id} following={following} />
                    <div className="absolute bottom-[60px] right-[35px] sm:right-[0px] ">
                      <ReelPopover following={following} videoId={post.video_id} />
                    </div>
                    <p className="absolute bottom-[-1] left-5 text-white p-2 rounded-md font-serif">{post.title}•{timeAgo(String(post.createdAt))}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute lg:-left-1/3 lg:top-1/2 md:-left-1/4 md:top-1/2 top-0 -right-2 ">
          <UploadReels />
        </div>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
