import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { StartScroll } from "./StartScroll";
import useActiveList from "@/hooks/useActiveList";
import { PulsatingCircle } from "../components/PulsingCircle";
import { useUser } from "@clerk/nextjs";
import { checkActivityOfAllUsers } from "../lib/actions/user.action";

function formatLastSeen(lastSeen: Date | null): React.JSX.Element | null {
  if (!lastSeen) {
    return <span className="text-white">away</span>;
  }

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffInSeconds = Math.round((now.getTime() - lastSeenDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return <span>a few seconds ago</span>;
  } else if (diffInSeconds < 3600) {
    return <span>{Math.floor(diffInSeconds / 60)} min</span>;
  } else if (diffInSeconds < 43200) {
    return <span>{Math.floor(diffInSeconds / 3600)} h</span>;
  }

  return null;
}

export function StartPopover({ person }: { person: User_with_interests_location_reason }) {
  const { members } = useActiveList();
  const isActive = members.indexOf(person?.clerkId!) !== -1;
  const { user, isLoaded } = useUser();
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    const getSession = async () => {
      if (user && isLoaded) {
        const sessions = await user.getSessions();
        console.log(sessions);

        const latestSession = sessions.reduce((latest: any, session: any) => {
          if (!latest || new Date(session.lastActiveAt) > new Date(latest.lastActiveAt)) {
            return session;
          }
          return latest;
        }, null);

        if (latestSession) {
          setLastSeen(new Date(latestSession.lastActiveAt));
        }
      }
    };
    getSession();
  }, [user, isLoaded]);

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
              <div className="absolute top-0 right-[-1rem] transform translate-x-1/2 -translate-y-1/2 text-[10px] mr-1">
                {formatLastSeen(person.lastSeen ? new Date(person.lastSeen) : null)}
              </div>
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
