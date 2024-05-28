import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Smile, X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import EmojiPicker, { EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';
import { addStartReel, createReel } from "@/lib/actions/post.action";
import { nanoid } from "nanoid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";


export function UploadReels() {
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [uploadRes, setUploadRes] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const {user} = useUser();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  const ID = nanoid(5);

  const handleUploadComplete = (res: any) => {
    setUploadRes(res[0]); 
    toast({
      description: `video uploaded`,
      style: {
        backgroundColor: "black",
        color: "white",
        border: "1px solid slate-800",
        width: "150px",
        height: "50px",
      },
    });
    setIsTitleModalOpen(true);
  };

  const handlePost = async() => {
    const fileUrl = uploadRes?.url; 
    await createReel(title, fileUrl, user?.id, user?.imageUrl);
    setIsPreviewModalOpen(false);
    router.push(`/reels/${user?.username}`);
  };

  const handleTitleSubmit = async () => {
    setIsTitleModalOpen(false);
    setIsPreviewModalOpen(true);

  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setTitle((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
            <Plus className="w-6 h-6 text-white" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[60vh] bg-black shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(err) => {
              console.error(err);
              alert("Upload failed!");
            }}
            className="bg-black text-white py-2 px-4 rounded"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTitleModalOpen} onOpenChange={setIsTitleModalOpen}>
        <DialogContent className="sm:max-w-[425px] h-[50vh] bg-black shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
          <DialogHeader>
            <DialogTitle className="text-white">Give your reel a cool name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-1 bg-black text-white border border-slate-600"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="flex-shrink-0" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile size={15} />
            </Button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-2 z-50 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
              <EmojiPicker
                width={300}
                height={400}
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.TWITTER}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleTitleSubmit}
            >
              Next
            </Button>
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800 absolute right-1 top-3 hover:text-slate-400"
              onClick={() => setIsTitleModalOpen(false)}
            >
              <X size={15} color="white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[300px] md:max-w-[325px] lg:max-w-[425px] h-[55vh] bg-black shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
          <div className="grid relative">
            <div className="flex flex-col items-center">
              <video 
                src={uploadRes?.url} 
                ref={videoRef} 
                autoPlay 
                muted 
                loop 
                onClick={handleVideoClick} 
                className="max-w-full flex items-center justify-center max-h-80 rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]" 
              />
              <div className="text-white w-full ml-[68px] font-serif">{title}<span className="text-slate-700">•</span>{}</div>
            </div>
            <Image 
              src={user?.imageUrl!} 
              alt="profile" 
              width={25} 
              height={25} 
              className="absolute bottom-10 left-10 rounded-full"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800"
              onClick={handlePost}
            >
              Post
            </Button>
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800 absolute right-1 top-3 hover:text-slate-400"
              onClick={() => setIsPreviewModalOpen(false)}
            >
              <X size={15} color="white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
