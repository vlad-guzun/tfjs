import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { StartScroll } from "./StartScroll";

export function StartPopover({person}: {person: User_with_interests_location_reason}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-white flex flex-col items-center">
          <Image src={person.photo} width={50} height={50} alt="img" className="rounded-md"/>
          <p className="font-serif text-xs">{person.username}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] h-[350px] p-0 overflow-hidden bg-black border-none">
        <StartScroll person={person}/>
      </PopoverContent>
    </Popover>
  );
}
