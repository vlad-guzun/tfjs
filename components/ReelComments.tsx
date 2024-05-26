import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BiSolidMessageRounded } from "react-icons/bi"
import { CommentsScrollArea } from "./CommentsScrollArea"

export function ReelComments({ videoId, following }: { videoId: string, following: User_with_interests_location_reason }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="absolute right-[17px] sm:right-[-16.5px] top-[54%] transform -translate-y-1/2 mr-4 text-white">
          <BiSolidMessageRounded size={22} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] bg-black border border-slate-800 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
        <CommentsScrollArea videoId={videoId} following={following} />
      </PopoverContent>
    </Popover>
  )
}
