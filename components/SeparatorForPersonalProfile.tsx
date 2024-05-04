import { Separator } from "@/components/ui/separator";
import { SignIn, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
export function SeparatorForPersonalProfile({personalProfile}: {personalProfile: User_with_interests_location_reason}) {
  
    return (
    <div className="flex flex-col items-center mt-56 mx-24">
      <div className="w-70p space-y-1">
        <div className="flex flex-col items-center justify-center gap-3">
          <Image src={personalProfile?.photo} width={200} height={200} alt={"img"} className="rounded-full" />
          <h4 className="text-lg text-white font-medium leading-none">{personalProfile?.username}</h4>
        </div>
      </div>
      <Separator className="my-4 w-70p border border-slate-800" />
      <div className="w-70p flex justify-center items-center space-x-4 text-sm text-white">
        <div className="text-slate-400">{`${personalProfile?.firstName} ${personalProfile?.lastName}`}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{personalProfile?.location}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{personalProfile?.interests}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <SignedIn>
            <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}
