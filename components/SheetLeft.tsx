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
import { getAllTheFollowingsTextPosts } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollTextDemo } from "./ScrollText";

export function SheetLeft() {
    const user = useUser();
    const [textPosts, setTextPosts] = useState<TextPostProps[]>([]);
    

    useEffect(() => {
        const fetchPosts = async () => {
            const text_posts = await getAllTheFollowingsTextPosts(user?.user?.id);
            console.log(text_posts);
            setTextPosts(text_posts);
        }
        fetchPosts();
    },[]);

  return (
    <Sheet>
      <SheetTrigger asChild>
      <Button variant="outline"><div className="text-black">Text</div></Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-black text-white border border-r-slate-700 border-l-slate-900 border-t-slate-900">
        <ScrollTextDemo user={user} textPosts={textPosts}/>
      </SheetContent>
    </Sheet>
  )
}
