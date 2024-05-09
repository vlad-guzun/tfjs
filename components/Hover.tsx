import { Button } from "@/components/ui/button"
import { HoverCardTrigger, HoverCardContent, HoverCard } from "@/components/ui/hover-card"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"

export default function Hover({completeOption,optionContent, textColor}: {completeOption: string,optionContent: string, textColor: string}) {
  return (
    <HoverCard >
      <HoverCardTrigger asChild>
       <div className="flex items-center"><Button variant="link" className="text-3xl"><h3 className={textColor}>{completeOption}</h3></Button></div> 
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-black text-white border border-slate-600">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <p className="text-sm"> {optionContent}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
