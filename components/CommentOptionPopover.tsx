import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IoHeartSharp } from "react-icons/io5"
import { SlOptions } from "react-icons/sl";
import { MdContentCopy } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { FaHighlighter } from "react-icons/fa";




export function CommentOptionPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button> <SlOptions size={8} color="white" className="hover:text-red-500" /></Button>
      </PopoverTrigger>
      <PopoverContent className=" w-42 bg-black text-white flex flex-col gap-2 border border-slate-700 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
        <div className="flex gap-2 hover:text-slate-400"><MdContentCopy className="text- hover:text-slate-400" size={15} /><p className="text-xs font-serif">Copy comment</p></div>
        <div className="flex gap-2 hover:text-slate-400"><FaHighlighter className="text- hover:text-slate-400" size={15} /><p className="text-xs font-serif">Highlight comment</p></div>
        <div className="flex gap-2 hover:text-slate-400"><MdReportProblem className="text- hover:text-slate-400" size={15} /><p className="text-xs font-serif">Report comment</p></div>


      </PopoverContent>
    </Popover>
  )
}
