import Image from "next/image";
import { Separator } from "./ui/separator";
import { Eye } from "lucide-react";
import Link from "next/link";

const Followings = ({followings}: {followings: User_with_interests_location_reason[]}) => {

  return (
    <div className="text-white mb-[150px]">
      <h1 className=" text-center text-3xl font-sans mt-16 text-slate-500">Following</h1>
                {followings?.map((following) =>  {
                    return (
                      <div className="flex flex-col items-center mt-56 mx-24">
      <div className="w-70p space-y-1">
        <div className="flex flex-col items-center justify-center gap-3">
          <Link href={`/profile/${following.username}`}>
            <Image src={following?.photo} width={200} height={200} alt={"img"} className="rounded-full" />
          </Link>
          <h4 className="text-lg text-white font-medium leading-none">{following?.username}</h4>
        </div>
      </div>
      <Separator className="my-4 w-70p border border-slate-800" />
      <div className="w-70p flex justify-center items-center space-x-4 text-sm text-white">
        <div className="text-slate-400">{`${following?.firstName} ${following?.lastName}`}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{following?.location}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <div className="text-slate-400">{following?.interests}</div>
        <Separator orientation="vertical" className="h-5 border border-slate-700" />
        <Link href={`/profile/${following.username}`}><Eye className="hover:text-slate-600" /></Link>
      </div>
    </div>
                    )
                })}
                
            </div>
          )
        }

export default Followings;
