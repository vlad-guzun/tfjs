import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { StartScroll } from "./StartScroll";

export function StartPopover({person}: {person: User_with_interests_location_reason}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Image src={person.photo} width={50} height={50} alt="img"/>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] h-[350px] p-0 overflow-hidden">
        <StartScroll person={person}/>
      </PopoverContent>
    </Popover>
  )
}
