import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllVideosById } from "@/lib/actions/user.action";
import { Eye, Heart, Plus, Send } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { CiPlay1 } from "react-icons/ci";
import { IoStopOutline } from "react-icons/io5";
import Image from "next/image";
import { HoverStarterTwo } from "./HoverStarterTwo";
import Link from "next/link";
import { LiaEye } from "react-icons/lia";
import { SiMariadbfoundation } from "react-icons/si";
import CopyProfileLink from "./CopyProfileLink";
import { StarterDialog } from "./StarterDialog";

interface VideoStyle {
  [url: string]: React.CSSProperties;
}

const VideoPlayer: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setIsPlaying(!video.paused);
    }
  };

  return (
    <div className="relative">
      <video src={src} ref={videoRef} style={style} className="rounded-sm" />
      <button
        onClick={togglePlay}
        className="absolute right-2 bottom-2 p-1 rounded-full shadow-md"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? <IoStopOutline className="text-xl" /> : <CiPlay1 className="text-xl" />}
      </button>
    </div>
  );
};

export function StartScroll({ person }: { person: User_with_interests_location_reason }) {
  const [videos, setVideos] = useState<VideoPostProps[]>([]);
  const [videoStyles, setVideoStyles] = useState<VideoStyle>({});

  useEffect(() => {
    const getAllVideos = async () => {
      const fetchedVideos = await getAllVideosById(person.clerkId);
      setVideos(fetchedVideos);
      updateVideoStyles(fetchedVideos);
      console.log(fetchedVideos);
      console.log(person.clerkId);
    };
    getAllVideos();
  }, [person.clerkId]);

  const updateVideoStyles = (videos: VideoPostProps[]) => {
    const tempStyles: VideoStyle = {};
    videos.forEach((video) => {
      const vid = document.createElement('video');
      vid.src = video.url;

      vid.onloadedmetadata = () => {
        if (vid.videoWidth > vid.videoHeight) {
          tempStyles[video.url] = {
            objectFit: 'contain',
            height: '100%',
            width: '100%'
          };
        } else {
          tempStyles[video.url] = {
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          };
        }
        setVideoStyles((prevStyles) => ({ ...prevStyles, ...tempStyles }));
      };
    });
  };

  return (
    <div className="flex h-full">
      <ScrollArea className="flex-1 rounded-md">
        <div className="text-black relative">
          {videos.length === 0 ? (
            <div className="flex items-center justify-center h-full flex-col border-r border-slate-800">
              <SiMariadbfoundation size={60} className="text-gray-300 mt-14" />
              <p className="text-gray-300 text-sm font-serif">No posts yet</p>
            </div>
          ) : (
            videos.map((video) => (
              <div className="relative mb-4" key={video.url}>
                <VideoPlayer src={video.url} style={videoStyles[video.url] || { width: "100%", height: "100%" }} />
                <Heart className="absolute text-red-500 right-2 bottom-[140px] text-2xl" />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="flex flex-col items-center ml-2">
        <Link href={`/myprofile/${person.username}`}><Image src={person.photo} width={40} height={40} alt="Profile picture" className="rounded-full" /></Link>
        <div className="flex flex-col items-center gap-[4px]">
          <StarterDialog icon={<Plus size={20} />} text={<span>Before following <span className="text-pink-600">{person.username} </span></span>}></StarterDialog>
          <StarterDialog icon={<Send size={18}/>} text={<span>Before sending a message to <span className="text-pink-600">{person.username} </span></span>}></StarterDialog>

          <CopyProfileLink username={person.username} />
        </div>
      </div>
    </div>
  );
}
