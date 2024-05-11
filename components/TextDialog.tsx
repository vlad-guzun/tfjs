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
import { ALargeSmall, Clapperboard, PencilLine, Text, WholeWord, X } from "lucide-react"
import { Label } from "./ui/label"
import { FormEvent, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { createTextPost } from "@/lib/actions/post.action"
  
  export function TextDialog() {

    const [input,setInput] = useState<string>("");
    const [textArea,setTextArea] = useState<string>("");
    const user = useUser();

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await createTextPost(input,textArea,user?.user?.id);
      window.location.reload();
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-black text-white hover:text-black hover:bg-white "><div className="flex flex-col items-center justify-center"><PencilLine size={30} /><Label>Text</Label></div></Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black text-white border border-slate-700">
          <AlertDialogHeader>
          <WholeWord />
            <AlertDialogTitle>
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="title" className="bg-black text-white border border-slate-700"/>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea value={textArea} onChange={e => setTextArea(e.target.value)} className="bg-black text-white border border-slate-700" placeholder="Description of the title"/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <form onSubmit={handleSubmit}>
              <AlertDialogCancel className="bg-black text-white border border-slate-700">Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit" className="bg-black text-white border border-slate-700 hover:bg-white hover:text-black">Post</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  