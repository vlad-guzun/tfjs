import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings2 } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "./ui/input";
import { updateReelTitle } from "@/lib/actions/post.action"; 

export function EditReelDialog({ reel, onEdit }: { reel: VideoPostProps, onEdit: (newTitle: string) => void }) {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [title, setTitle] = useState<string>(reel.title);
  const [saving, setSaving] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await updateReelTitle(reel.video_id, title);
      onEdit(title);
    } catch (error) {
      console.error('Error updating reel title:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Settings2 size={15} /> <p className="text-sm font-serif ml-1">edit</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-full sm:max-w-sm mx-auto p-4 bg-black rounded-md shadow-lg border-none">
        <div className="relative w-full pt-[177.78%] h-0">
          <video
            ref={videoRef}
            src={reel.url}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
            playsInline
            loop
            onClick={handleVideoClick}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="editTitle" className="text-white font-serif">
            Edit Title
          </label>
          <Input
            type="text"
            id="editTitle"
            className="w-full bg-black text-white rounded-md p-2 mt-2 border-none shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <AlertDialogFooter className="flex justify-end mt-4">
          <AlertDialogCancel className="text-white border-none bg-transparent bg-black hover:bg-black hover:text-slate-400 p-2 rounded-md">
            <p>cancel</p>
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleEdit} disabled={saving} className="ml-2 text-white text-sm font-serif bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
            {saving ? 'Saving...' : 'Save'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
