import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDownToLine, AtSign, EllipsisVertical, Share2, Trash } from "lucide-react";
import { DeleteReelDialog } from "./DeleteReelDialog";
import { EditReelDialog } from "./EditReelDialog";

export function OptionsReelPopover({ reel, onDelete, onEdit }: { reel: VideoPostProps, onDelete: () => void, onEdit: (newTitle: string) => void }) {
  const downloadReel = (url: string, title: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(console.error);
  };

  const shareReel = (url: string, title: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: url,
        })
        .then(() => console.log("Successfully shared"))
        .catch(console.error);
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVertical color="white" size={15} />
      </PopoverTrigger>
      <PopoverContent className="w-32 bg-black text-white p-4 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
        <div className="flex items-center mb-2 cursor-pointer hover:text-gray-400">
          <EditReelDialog reel={reel} onEdit={onEdit} />
        </div>
        <div className="flex items-center mb-2 cursor-pointer hover:text-gray-400">
          <AtSign className="mr-2" size={15} />
          <p className="font-serif text-sm">mention</p>
        </div>
        <div
          className="flex items-center mb-2 cursor-pointer hover:text-gray-400"
          onClick={() => downloadReel(reel.url, reel.title)}
        >
          <ArrowDownToLine className="mr-2" size={15} />
          <p className="font-serif text-sm">download</p>
        </div>
        <div
          className="flex items-center mb-2 cursor-pointer hover:text-gray-400"
          onClick={() => shareReel(reel.url, reel.title)}
        >
          <Share2 className="mr-2" size={15} />
          <p className="font-serif text-sm">share</p>
        </div>
        <div className="flex items-center cursor-pointer hover:text-gray-400">
          <DeleteReelDialog reel={reel} onDelete={onDelete} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
