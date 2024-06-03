"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {  getAllPersonsYouFollow, getAllUsers, getReelsAndAssociatedInfoForRender, update_all_the_video_in_fulluser_with_its_embedding } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { ReelPopover } from "./ReelPopover";
import { ReelComments } from "./ReelComments";
import { UploadReels } from "../components/UploadReels";
import { ReelSkeleton } from "./ReelSkeleton";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs";
import { generate_similar_reels } from "@/lib/actions/generate.similar.people";

interface Screen_shot_props {
  videoId: string;
  screenshots: string[];
}

export function CarouselOrientation() {
  const { user } = useUser();
  const [followings, setFollowings] = useState<User_with_interests_location_reason[]>([]);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [useModel, setUseModel] = useState<use.UniversalSentenceEncoder | null>(null);

  useEffect(() => {
    async function fetchData() {
      await tf.setBackend("webgl");
      await tf.ready();
      console.log("TensorFlow backend setup complete");

      const mobilenetModel = await mobilenet.load();
      const useModel = await use.load();
      setModel(mobilenetModel);
      setUseModel(useModel);
      console.log("MobileNet model and Universal Sentence Encoder loaded");

      try {
        const followings: User_with_interests_location_reason[] = await getAllPersonsYouFollow(user?.id);
        setFollowings(followings);
        setLoading(false);

        const allPersons = await getAllUsers();
        const allReels = allPersons.flatMap((user:any) => user.video_posts || []);

        const response = await fetch("/api/generate-screenshot", {
          method: "POST",
          body: JSON.stringify({ reels: allReels }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const allScreenshots: Screen_shot_props[] = data.data;

        const classificationResults = await Promise.all(
          allScreenshots.map(async (screenShot) => {
            const classifications = await Promise.all(
              screenShot.screenshots.map(async (url) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = url;
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                });
                const predictions = await mobilenetModel.classify(img);
                return predictions[0].className;
              })
            );
            return {
              videoId: screenShot.videoId,
              classifications,
            };
          })
        );

        console.log("Classification results:", classificationResults);

        const embeddingResults = await Promise.all(
          classificationResults.map(async (result) => {
            const uniqueClassifications = Array.from(new Set(result.classifications)).join(", ");
            const embedding = await useModel.embed([uniqueClassifications]);
            const embeddingArray = Array.from(embedding.arraySync()[0]);
            return {
              videoId: result.videoId,
              embedding: embeddingArray,
            };
          })
        );

        const result = await update_all_the_video_in_fulluser_with_its_embedding(embeddingResults);
        console.log("Embedding results:", result);

      } catch (error) {
        console.error("Error fetching or processing data:", error);
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };







  const toggleLike = async (videoId: string, url: string,title: string) => {
    const response = await fetch("/api/generate-screenshot2", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const video_screenshots = await (await response.json()).data.screenshots;

    if (model && useModel) {
      const classifications = await Promise.all(
        video_screenshots.map(async (url: string) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const predictions = await model.classify(img);
          return predictions[0].className;
        })
      );

      const uniqueClassifications = Array.from(new Set(classifications)).join(", ");
      const embedding = await useModel.embed([uniqueClassifications]);
      const embeddingArray = Array.from(embedding.arraySync()[0]);
      const similar_reels_ids: string[] = await generate_similar_reels(embeddingArray);
      console.log("Similar reels ids:", similar_reels_ids);
      const render = await getReelsAndAssociatedInfoForRender(similar_reels_ids);
      console.log("Render:", render);

    }

    setLiked((prevLiked) => ({
      ...prevLiked,
      [videoId]: !prevLiked[videoId],
    }));
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
            return following.video_posts.map((post, postIndex) => {
              const videoIndex = followingIndex * 1000 + postIndex;
              return (
                <CarouselItem key={post.video_id} className="h-full">
                  <Card className="h-full bg-black border-none relative">
                    <CardContent className="bg-black relative">
                      <video
                        className="h-full w-full rounded-lg"
                        src={post.url}
                        playsInline
                        loop
                        controls={false}
                        onClick={handleVideoClick}
                      ></video>
                      <IoIosHeart
                        onClick={() => toggleLike(post.video_id, post.url,post.title)}
                        className={`absolute right-[17px] sm:right-[-18px] top-1/2 transform -translate-y-1/2 mr-4 ${liked[post.video_id] ? 'text-red-500' : 'text-white'}`}
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
            });
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
