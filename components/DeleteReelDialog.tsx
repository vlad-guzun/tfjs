import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Trash, X } from "lucide-react";
  import { useState, useRef } from "react";
  
  export function DeleteReelDialog({ reel }: { reel: VideoPostProps }) {
    const [playing, setPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
  
    const handleVideoClick = () => {
      if (videoRef.current) {
        if (playing) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setPlaying(!playing);
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex text-red-700 items-center cursor-pointer">
            <Trash size={15} /> <p className="text-sm font-serif ml-1">delete</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-full sm:max-w-sm mx-auto p-4 bg-black rounded-md shadow-lg border-none">
          <div className="relative w-full pt-[177.78%] h-0">
            <video
              ref={videoRef}
              src={reel.url}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
              playsInline
              loop
              onClick={handleVideoClick}
            />
          </div>
          <AlertDialogFooter className="flex justify-end mt-4">
            <AlertDialogCancel className="text-white border-none  bg-transparent bg-black hover:bg-black hover:text-slate-400 p-2 rounded-md">
              <p>cancel</p>
            </AlertDialogCancel>
            <AlertDialogAction className="ml-2 text-white text-sm font-serif bg-red-600 hover:bg-red-700 p-2 rounded-md">
              confirm delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <style jsx>{`
          video::-webkit-media-controls-panel {
            display: none !important;
          }
  
          video::-webkit-media-controls-play-button,
          video::-webkit-media-controls-volume-slider,
          video::-webkit-media-controls-timeline-container,
          video::-webkit-media-controls-current-time-display,
          video::-webkit-media-controls-time-remaining-display,
          video::-webkit-media-controls-fullscreen-button {
            display: none !important;
          }
        `}</style>
      </AlertDialog>
    );
  }
  