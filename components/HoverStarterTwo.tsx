
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { Plus } from "lucide-react"
  import Link from "next/link"
import React from "react"
  import { TiEyeOutline } from "react-icons/ti"
  
  export function HoverStarterTwo({icon,text}: {text: React.ReactNode,icon: React.ReactNode}) {
  
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
           {icon}
        </HoverCardTrigger>
        <HoverCardContent className="w-42 font-serif bg-black text-white border border-slate-800">
            <Link href={"/change"}>{text}</Link>
        </HoverCardContent>
      </HoverCard>
    )
  }
  