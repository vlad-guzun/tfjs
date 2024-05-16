import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getAllTheFollowingsVideoPosts } from "@/lib/actions/user.action";
import { Separator } from "@radix-ui/react-dropdown-menu";


const timeSince = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (seconds < 60) return "just now";
  else if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  else if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  else return "more than 1 day ago";
}

export function ScrollVideoDemo({ user, videoPosts }: { user: any, videoPosts: VideoPostProps[] }) {
    const [videos, setVideos] = useState<VideoPostProps[]>([]);

    useEffect(() => {
        const fetchVideoPosts = async () => {
            const video_posts = await getAllTheFollowingsVideoPosts(user?.user?.id);
            setVideos(video_posts);
        };
        fetchVideoPosts();
    }, []);

    return (
        <ScrollArea className="h-screen w-full overflow-hidden">
            {videos.map((post, index) => (
                <div key={index} className="border-b border-gray-200">
                    <div className="flex flex-col mb-20">
                        <video src={post.url} 
                            controls
                            className="w-full aspect-video"
                        />
                        <div className="px-4 py-2 flex flex-col">   
                            <div className="flex items-center space-x-3">
                                <Image src={post.profile_photo} height={30} width={30} className="rounded-full" alt="User profile"/>
                                <h2 className="text-med">{post.title}</h2>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-500">{timeSince(post.createdAt)}</span>
                                <Heart className="text-red-500 cursor-pointer" size={15} />
                            </div>
                        </div>
                        <Separator style={{border: '1px solid #121212'}} className="my-2 mt-4"/>
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
}
