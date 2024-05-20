import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { StartScroll } from "./StartScroll";
import useActiveList from "@/hooks/useActiveList";
import { PulsatingCircle } from "../components/PulsingCircle";  

export function StartPopover({ person }: { person: User_with_interests_location_reason }) {
  const { members } = useActiveList();
  const isActive = members.indexOf(person?.clerkId!) !== -1;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="text-white flex flex-col items-center relative">
            <Image src={person.photo} width={50} height={50} alt="img" className="rounded-md" />
            {isActive ? (
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                <PulsatingCircle />
              </div>
            ) : (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">offline</span>
            )}
            <p className="font-serif text-xs">{person.username}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] h-[350px] p-0 overflow-hidden bg-black border-none">
          <StartScroll person={person} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
