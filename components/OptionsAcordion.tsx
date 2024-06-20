"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { RiHomeFill } from "react-icons/ri";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import Search from "@/components/Search";
import { useUser } from "@clerk/nextjs";
import { MdAccountCircle } from "react-icons/md";


export function OptionsAccordion() {



    const {user} = useUser();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
            
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3 w-full items-center font-serif">
            <Link href={"/"}>
              <div className="flex items-center justify-start w-24">
                <RiHomeFill className="mr-2" />
                <p>home</p>
              </div>
            </Link>
            <Link href={`/reels/user`}>
              <div className="flex items-center justify-start w-24">
                <MdOutlineSlowMotionVideo className="mr-2" />
                <p>reels</p>
              </div>
            </Link>
            <Link href={`/inbox`}>
              <div className="flex items-center justify-start w-24">
                <BsFillSendFill className="mr-2" />
                <p>messages</p>
              </div>
            </Link>
            <Link href={`/myprofile/${user?.username}`}>
              <div className="flex items-center justify-start w-24">
                <MdAccountCircle className="mr-2" />
                <p className="font-serif">my profile</p>
              </div>
            </Link>
            <div className="w-full">
              <Search />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
