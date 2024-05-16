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
import { Type } from "lucide-react";

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
      <Button variant="outline" className="hover:bg-black hover:text-white text-black px-8 py-6"><div className="font-serif">Text <Type /></div></Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-black text-white border border-r-slate-700 border-l-slate-900 border-t-slate-900">
        <ScrollTextDemo/>
      </SheetContent>
    </Sheet>
  )
}
