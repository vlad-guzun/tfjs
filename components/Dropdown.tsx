"use client";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@clerk/nextjs"
import { CircleUserRound, Ellipsis, EllipsisVertical, Home, Rss, Send, UsersRound } from "lucide-react"
import Link from "next/link";

export function DropdownMenuDemo() {
  const user = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="text-white bg-black">
        <Button className="text-white bg-black "><EllipsisVertical /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" text-white bg-black border border-slate-700 w-[30px]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/`}><Home /></Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/myprofile/${user?.user?.username}`}><CircleUserRound /></Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/feed/${user?.user?.username}`}><Rss /></Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/following/${user?.user?.username}`}><UsersRound /></Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
