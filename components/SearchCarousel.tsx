import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const formatTime = (date: string | Date) => {
  const now = new Date();
  const parsedDate = new Date(date);
  const diff = (now.getTime() - parsedDate.getTime()) / 1000; 

  if (diff < 60) {
    return `${Math.floor(diff)}s`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  } else {
    return `${Math.floor(diff / 86400)}d`;
  }
};

export function SearchCarousel({ reels }: { reels: VideoPostProps[] }) {
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoPlay = (videoId: string) => {
    const currentVideo = videoRefs.current[videoId];
    if (currentVideo && !playing[videoId]) {
      currentVideo.play();
      setPlaying((prevState) => ({
        ...prevState,
        [videoId]: true,
      }));
    }
  };

  const handleVideoPause = (videoId: string) => {
    const currentVideo = videoRefs.current[videoId];
    if (currentVideo && playing[videoId]) {
      currentVideo.pause();
      setPlaying((prevState) => ({
        ...prevState,
        [videoId]: false,
      }));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleVideoPlay(entry.target.id);
          } else {
            handleVideoPause(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } 
    );

    const videos = Object.values(videoRefs.current);
    videos.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videos.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [reels]);

  return (
    <div>
      <style jsx>{`
        .carousel-dots {
          display: none;
        }
      `}</style>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[300px] ">
          {reels.map((reel) => (
            <CarouselItem key={reel.video_id} className="md:basis-1/2 border border-none ">
              <Card className="border-none">
                <CardContent className="flex items-center justify-center bg-black border-none flex-col">
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[reel.video_id] = el;
                        el.id = reel.video_id; 
                      }
                    }}
                    src={reel.url}
                    className="w-full h-full object-cover rounded-lg"
                    tabIndex={0} 
                  />
                  <div className="flex items-center justify-start">
                    <span className="text-white text-xs">{reel.title}</span><span className="text-slate-400 mx-1">•</span>
                    <span className="text-white text-xs">
                      {formatTime(reel.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
