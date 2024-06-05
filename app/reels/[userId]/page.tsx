"use client";
import { CarouselOrientation } from "@/components/Reels"
import { useUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";

const ReelsPage = () => {
  const {user} = useUser();
  return <div className="h-screen w-full flex justify-center"><CarouselOrientation />
        <div className="text-white fixed bottom-0 left-0 p-3"><Link href={`/myprofile/${user?.username}`}><Image src={`${user?.imageUrl}`} width={30} height={30} alt="profiel" className="rounded-md"/></Link></div>
    </div>
}

export default ReelsPage
