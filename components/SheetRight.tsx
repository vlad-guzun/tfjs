"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getAllTheFollowingsTextPosts, getAllTheFollowingsVideoPosts } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollTextDemo } from "./ScrollText";
import { ScrollVideoDemo } from "./ScrollVideo";

export function SheetRight() {
    const user = useUser();
    const [videoPosts, setVideoPosts] = useState<VideoPostProps[]>([]);
    

    useEffect(() => {
        const fetchPosts = async () => {
            const video_posts = await getAllTheFollowingsVideoPosts(user?.user?.id);
            console.log(video_posts);
            setVideoPosts(videoPosts);
            console.log('gsgesges');
        }
        fetchPosts();
    },[]);

  return (
    <Sheet>
      <SheetTrigger asChild>
      <Button variant="outline"><div className="text-black">Video</div></Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="bg-black text-white border border-l-slate-800 border-t-slate-800">
        <ScrollVideoDemo user={user} videoPosts={videoPosts}/>
      </SheetContent>
    </Sheet>
  )
}
