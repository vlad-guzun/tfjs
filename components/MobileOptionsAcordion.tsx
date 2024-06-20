"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import { Home, Circle, Rss, Send, Users, EllipsisVertical, ChevronDown } from "lucide-react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

import Link from "next/link";

export function DropdownMenuDemoMobile() {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="text-white bg-black">
        <Button className="text-white bg-black"><ChevronDown /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-white bg-black border border-slate-700">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/`} className="flex items-center">
              <Home className="mr-2" /> Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/myprofile/${user?.username}`} className="flex items-center">
              <Circle className="mr-2" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/reels/${user?.username}`} className="flex items-center">
              <MdOutlineSlowMotionVideo size={28} className="mr-2" /> Feed
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/following/${user?.username}`} className="flex items-center">
              <Users className="mr-2" /> Following
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/inbox`} className="flex items-center">
              <Send className="mr-2" /> Messages
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
