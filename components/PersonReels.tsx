import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useRef } from "react";

interface VideoPostProps {
  url: string;
  title: string;
}

interface UserWithInterestsLocationReason {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  interests: string;
  location: string;
  reasonForJoining: string;
  following?: string[];
  feedback?: any[];
  text_posts?: any[];
  video_posts?: VideoPostProps[];
  lastSeen?: Date;
}

export function PersonReels({ following }: { following: UserWithInterestsLocationReason }) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
  }, [following?.video_posts]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[450px]">
          {following?.video_posts?.map((post, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <div className="p-1">
                <Card className="h-[400px] bg-black border-none">
                  <CardContent className="flex items-center justify-center p-0 bg-black">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={post.url}
                      className="h-full w-full object-cover rounded-md"
                      playsInline
                      loop
                      controls={false}
                      onClick={handleVideoClick}
                    ></video>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
