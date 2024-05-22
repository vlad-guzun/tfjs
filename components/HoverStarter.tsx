
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
import Link from "next/link"
import { TiEyeOutline } from "react-icons/ti"

export function HoverStarter({person}: {person: User_with_interests_location_reason}) {

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/myprofile/${person.username}`}><TiEyeOutline color="white" size={25}/></Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-42 font-serif bg-black text-white">
        <Link href={`/myprofile/${person.username}`}>See <span className="text-pink-600">{person.username}</span> profile</Link>
      </HoverCardContent>
    </HoverCard>
  )
}
