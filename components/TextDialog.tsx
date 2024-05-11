import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Clapperboard, PencilLine, X } from "lucide-react"
import { Label } from "./ui/label"
  
  export function TextDialog() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-black text-white hover:text-black hover:bg-white "><div className="flex flex-col items-center justify-center"><PencilLine size={30} /><Label>Text</Label></div></Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black text-white border border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle><Input placeholder="title" className="bg-black text-white border border-slate-700"/></AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea className="bg-black text-white border border-slate-700" placeholder="Description of the title"/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black text-white border border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-black text-white border border-slate-700 hover:bg-white hover:text-black">Post</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  