import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAllTheFollowingsVideoPosts } from "@/lib/actions/user.action";
import { Heart } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { CiPlay1 } from "react-icons/ci";
import { IoStopOutline } from "react-icons/io5";

interface VideoPostProps {
    url: string;
    clerkId: string;
}

interface User_with_interests_location_reason {
    clerkId: string;
}

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
            <video src={src} ref={videoRef} style={style} />
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
            const fetchedVideos = await getAllTheFollowingsVideoPosts(person.clerkId);
            setVideos(fetchedVideos);
            updateVideoStyles(fetchedVideos);
        };
        getAllVideos();
    }, [person.clerkId]);

    const updateVideoStyles = (videos: VideoPostProps[]) => {
        const tempStyles: VideoStyle = {};
        videos.forEach((video) => {
            const vid = document.createElement('video');
            vid.src = video.url;

            vid.onloadedmetadata = () => {
                // Check if video is portrait or landscape
                if (vid.videoWidth > vid.videoHeight) {
                    // Landscape
                    tempStyles[video.url] = {
                        objectFit: 'contain',
                        height: '100%',
                        width: '100%'
                    };
                } else {
                    // Portrait
                    tempStyles[video.url] = {
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%' // Adjust if necessary
                    };
                }
                setVideoStyles((prevStyles) => ({ ...prevStyles, ...tempStyles }));
            };
        });
    };

    return (
        <ScrollArea className="h-full w-full rounded-md border border-slate-800">
            <div className="text-black relative">
                {videos.map((video) => (
                    <div key={video.url} className="relative mb-4">
                        <VideoPlayer src={video.url} style={videoStyles[video.url] || { width: '100%', height: '100%' }} />
                        <Separator />
                        <Heart className="absolute text-red-500 right-2 bottom-[140px] text-2xl" />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
