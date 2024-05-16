import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

const timeSince = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (seconds < 60) return "just now";
  else if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  else if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  else return "more than 1 day ago";
}

export function ScrollTextDemo({ user, textPosts }: { user: any, textPosts: TextPostProps[] }) {
  useEffect(() => {
    console.log(user);
    console.log(textPosts);
  }, []);

  return (
    <ScrollArea className="h-screen w-full rounded-md">
      {textPosts.map((post, index) => (
        <div key={index} className="relative p-4">
          <Image src={post.profile_photo} height={30} width={30} className="rounded-full" alt="img"/>
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-base">{post.description}</p>
            <p className="text-sm text-gray-500">{timeSince(post.createdAt)}</p>
          </div>
          <Separator className="my-2 border mt-4" style={{border: '1px solid #121212'}}/>

          <Heart className="absolute bottom-0 right-0 mb-8 mr-2 text-red-500" size={24} />
        </div>
        
      ))}
    </ScrollArea>
  );
}
