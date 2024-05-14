import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Heart } from "lucide-react";
import Link from "next/link";


export function TextScrollBar({text,user}: {text: TextPostProps[],user: any}) {
  return (
      <ScrollArea className="flex-1 h-screen rounded-md" style={{ overflowY: "auto" }}>
        <div className="p-4">
            {text.map((post, index) => (
            <div key={index} className="relative rounded-md p-4 mx-auto h-[170px]">
                <img src={post.profile_photo} alt="Profile" className="absolute top-0 left-0 w-8 h-8 rounded-full m-2" />

                <div className="ml-12 mt-8  bg-slate-700 bg-opacity-20 py-3 mr-5 rounded-lg">
                <h3 className="text-lg font-semibold pl-3">{post.title}</h3>
                <p className="text-sm pl-3">{post.description}</p>
                </div>

                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 mb-5 mr-4">
                <Heart className="text-red-500 " size={20}/>
                </div>
            <div className="w-full border border-b mt-12 border-slate-900"></div>
            </div>
            ))}
        </div>
        </ScrollArea>
  );
}
