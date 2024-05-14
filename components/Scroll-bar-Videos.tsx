import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";


export function VideosScrollBar({ videos, user }: { videos: VideoPostProps[], user: any }) {
  return (
    <ScrollArea className="flex-1 h-screen rounded-md">
      <div className="p-4">
        {videos.map((video, index) => (
          <div key={index} className="relative rounded-md p-4 mx-auto mb-4">
            <video src={video.url} controls className="block mx-auto mb-4" style={{ maxWidth: "350px" }} />
            <img src={video.profile_photo} alt="Profile" className="absolute top-0 left-0 w-8 h-8 rounded-full m-2" />
            <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 mr-14 mb-10">
              <Heart className="text-red-800" />
            </div>
            <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 mr-[85px] mb-10">
              <FaCommentDots size={25} className="text-green-800" />
            </div>
            <div className="ml-12">
              <h3 className="text-lg font-semibold pb-2">{video.title}</h3>
            </div>
            <div className="border border-b border-slate-900"></div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
