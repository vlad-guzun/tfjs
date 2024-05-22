import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllVideosById } from "@/lib/actions/user.action";
import { Copy, Heart, Plus, Share } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { CiPlay1 } from "react-icons/ci";
import { IoStopOutline } from "react-icons/io5";
import Image from "next/image";
import { Send } from "lucide-react";
import { BsFillShareFill } from "react-icons/bs";
import { HoverStarter } from "./HoverStarter";
import { HoverStarterTwo } from "./HoverStarterTwo";
import Link from "next/link";
import { LiaEye } from "react-icons/lia";


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
                    {videos.map((video) => (
                        <div className="relative mb-4" key={video.url}>
                            <VideoPlayer src={video.url} style={videoStyles[video.url] || { width: '100%', height: '100%' }} />
                            <Heart className="absolute text-red-500 right-2 bottom-[140px] text-2xl" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="flex flex-col items-center ml-2">
                <Image src={person.photo} width={40} height={40} alt="Profile picture" className="rounded-full" />
                <div className="flex flex-col items-center gap-[6px]">
                    <HoverStarterTwo icon={<Link href={`/myprofile/${person.username}`}><LiaEye className="mt-3" color="white" size={20}/></Link>} text={<span>see <span className="text-pink-500">{person.username}</span> profile</span>} />
                    <HoverStarterTwo icon={<Link href={`/change`}><Plus color="white" size={24}/></Link>} text={<span>follow <span className="text-pink-500">{person.username}</span></span>} />
                    <HoverStarterTwo icon={<Link href={`/send`}><Send color="white" size={18}/></Link>} text={<span>send <span className="text-pink-500">{person.username}</span> a private message</span>} />
                    <HoverStarterTwo icon={<Link href={`/copy`}><Copy className="mt-1" color="white" size={18}/></Link>} text={<span>copy <span className="text-pink-500">{person.username}</span> profile</span>} />
                </div>
            </div>
        </div>
    );
}
