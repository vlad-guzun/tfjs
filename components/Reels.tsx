"use client";
require("@tensorflow/tfjs");

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getAllPersonsYouFollow, getAllUsers, getReelsAndAssociatedInfoForRender, update_all_the_video_in_fulluser_with_its_embedding } from "@/lib/actions/user.action";
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

interface VideoPost {
  title: string;
  url: string;
  profile_photo: string;
  video_id: string;
  embedded_video: number[];
  comments: {
    commenter: string;
    commenter_photo: string;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

interface RenderedFollowing {
  video: {
    title: string;
    url: string;
    profile_photo: string;
    video_id: string;
    embedded_video: number[];
    comments: {
      commenter: string;
      commenter_photo: string;
      comment: string;
      createdAt: Date;
    }[];
    createdAt: Date;
  };
  user: {
    clerkId: string;
    email: string;
    username: string;
    photo: string;
    firstName: string;
    lastName: string;
    interests: string;
    location: string;
    reasonForJoining: string;
    following: string[];
    feedback: {
      recipient: string;
      sentiment: number;
    }[];
    lastSeen: Date;
  };
}

export function CarouselOrientation() {
  const { user } = useUser();
  const [followings, setFollowings] = useState<RenderedFollowing[]>([]);
  const [additionalFollowings, setAdditionalFollowings] = useState<RenderedFollowing[]>([]);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [useModel, setUseModel] = useState<use.UniversalSentenceEncoder | null>(null);

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const followings = await getAllPersonsYouFollow(user?.id);

        const transformedFollowings: RenderedFollowing[] = followings.map((following: any) => {
          if (following.video_posts && following.video_posts.length > 0) {
            const post = following.video_posts[0];
            return {
              video: {
                title: post.title,
                url: post.url,
                profile_photo: post.profile_photo,
                video_id: post.video_id,
                embedded_video: post.embedded_video,
                comments: post.comments,
                createdAt: post.createdAt,
              },
              user: {
                clerkId: following.clerkId,
                email: following.email,
                username: following.username,
                photo: following.photo,
                firstName: following.firstName,
                lastName: following.lastName,
                interests: following.interests,
                location: following.location,
                reasonForJoining: following.reasonForJoining,
                following: following.following,
                feedback: following.feedback,
                lastSeen: following.lastSeen,
              },
            };
          }
          return null;
        }).filter((following: any) => following !== null);

        setFollowings(transformedFollowings as RenderedFollowing[]);
        setLoading(false);

        fetchEmbeddingsAndUpdate();
      } catch (error) {
        console.error("Error fetching followings:", error);
        setLoading(false);
      }
    }

    async function fetchEmbeddingsAndUpdate() {
      await tf.setBackend("webgl");
      await tf.ready();
      console.log("TensorFlow backend setup complete");

      const mobilenetModel = await mobilenet.load();
      const useModel = await use.load();
      setModel(mobilenetModel);
      setUseModel(useModel);
      console.log("MobileNet model and Universal Sentence Encoder loaded");

      try {
        const allUsers = await getAllUsers();
        const allReels = allUsers.flatMap((user: any) => user.video_posts || []);

        console.log("Sending reels data to /api/generate-screenshot:", { reels: allReels });

        const response = await fetch("/api/generate-screenshot", {
          method: "POST",
          body: JSON.stringify({ reels: allReels }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch screenshots: ${response.statusText}`);
        }

        const data = await response.json();
        const allScreenshots: Screen_shot_props[] = data.data;

        const classificationPromises = allScreenshots.map(async (screenShot) => {
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
        });

        const classificationResults = await Promise.all(classificationPromises);

        console.log("Classification results:", classificationResults);

        const embeddingPromises = classificationResults.map(async (result) => {
          const uniqueClassifications = Array.from(new Set(result.classifications)).join(", ");
          const embedding = await useModel.embed([uniqueClassifications]);
          const embeddingArray = Array.from(embedding.arraySync()[0]);
          return {
            videoId: result.videoId,
            embedding: embeddingArray,
          };
        });

        const embeddingResults = await Promise.all(embeddingPromises);

        const result = await update_all_the_video_in_fulluser_with_its_embedding(embeddingResults);
        console.log("Embedding results:", result);
      } catch (error) {
        console.error("Error fetching or processing embeddings:", error);
      }
    }

    if (user?.id) {
      setLoading(true);
      setTimeout(() => {
        fetchFollowings();
      }, 1000); 
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

  const toggleLike = async (videoId: string, url: string, title: string) => {
    setLiked((prevLiked) => ({
      ...prevLiked,
      [videoId]: !prevLiked[videoId],
    }));

    const response = await fetch("/api/generate-screenshot2", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to generate screenshots for video ${videoId}: ${response.statusText}`);
      return;
    }

    const video_screenshots = await (await response.json()).data.screenshots;

    if (model && useModel) {
      const classificationPromises = video_screenshots.map(async (url: string) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const predictions = await model.classify(img);
        return predictions[0].className;
      });

      const classifications = await Promise.all(classificationPromises);

      const uniqueClassifications = Array.from(new Set(classifications)).join(", ");
      const embedding = await useModel.embed([uniqueClassifications]);
      const embeddingArray = Array.from(embedding.arraySync()[0]);
      const similar_reels_ids = await generate_similar_reels(embeddingArray);
      console.log("Similar reels ids:", similar_reels_ids);
      const render = await getReelsAndAssociatedInfoForRender(similar_reels_ids);
      console.log("Render:", render);

      const transformedSimilarFollowings: RenderedFollowing[] = render.map((following: any) => {
        if (following.video && following.video.video_id) {
          return {
            video: {
              title: following.video.title,
              url: following.video.url,
              profile_photo: following.video.profile_photo,
              video_id: following.video.video_id,
              embedded_video: following.video.embedded_video,
              comments: following.video.comments,
              createdAt: following.video.createdAt,
            },
            user: {
              clerkId: following.user.clerkId,
              email: following.user.email,
              username: following.user.username,
              photo: following.user.photo,
              firstName: following.user.firstName,
              lastName: following.user.lastName,
              interests: following.user.interests,
              location: following.user.location,
              reasonForJoining: following.user.reasonForJoining,
              following: following.user.following,
              feedback: following.user.feedback,
              lastSeen: following.user.lastSeen,
            },
          };
        }
        return null;
      }).filter((following: any) => following !== null);

      setAdditionalFollowings(prev => [...prev, ...transformedSimilarFollowings]);
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const units = [
      { name: "w", seconds: 604800 },
      { name: "d", seconds: 86400 },
      { name: "h", seconds: 3600 },
      { name: "m", seconds: 60 },
      { name: "s", seconds: 1 },
    ];

    for (const unit of units) {
      const quotient = Math.floor(diffInSeconds / unit.seconds);
      if (quotient > 0) {
        return `${quotient}${unit.name}`;
      }
    }

    return "just now";
  };

  const allFollowings = [...followings, ...additionalFollowings];

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
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index} className="h-full">
                <Card className="h-full bg-black border-none relative">
                  <CardContent className="bg-black relative">
                    <ReelSkeleton />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          {!loading &&
            allFollowings.map((following, index) => {
              if (!following.video || !following.video.video_id) return null;
              return (
                <CarouselItem key={`${following.video.video_id}-${index}`} className="h-full">
                  <Card className="h-full bg-black border-none relative">
                    <CardContent className="bg-black relative">
                      <video
                        className="h-full w-full rounded-lg"
                        src={following.video.url}
                        playsInline
                        loop
                        controls={false}
                        onClick={handleVideoClick}
                      ></video>
                      <IoIosHeart
                        onClick={() => toggleLike(following.video.video_id, following.video.url, following.video.title)}
                        className={`absolute right-[17px] sm:right-[-18px] top-1/2 transform -translate-y-1/2 mr-4 ${
                          liked[following.video.video_id] ? "text-red-500" : "text-white"
                        }`}
                        size={25}
                      />
                      <ReelComments videoId={following.video.video_id} following={following.user} />
                      <div className="absolute bottom-[55px] lg:right-2 sm:right-[0px] right-[51px]">
                        <ReelPopover following={following.user} videoId={following.video.video_id} />
                      </div>
                      <p className="absolute bottom-[-1] left-5 text-white p-2 rounded-md font-serif">
                        {following.video.title}•{timeAgo(String(following.video.createdAt))}
                      </p>
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
