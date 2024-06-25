import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GrFormNext } from "react-icons/gr";
import { useRef, useState } from "react";
import Image from "next/image";
import { IoChevronBackSharp } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SendHorizontal } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "../hooks/useStore";
import { useRouter } from "next/navigation";

interface ContinuePreviewProps {
  reel: VideoPostProps;
  selectedProfilePics: User_with_interests_location_reason[];
}

export function ContinuePreview({ reel, selectedProfilePics }: ContinuePreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const router = useRouter();

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

  const handleUserClick = async (user: User_with_interests_location_reason) => {
    setSelectedUser(user);
    router.push("/inbox");
  };

  const visibleProfilePics = selectedProfilePics.slice(0, 3);
  const hiddenProfilePics = selectedProfilePics.length > 3 ? selectedProfilePics.slice(3) : [];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button><GrFormNext size={25} /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] h-[700px] border-none">
        <div>
          <video
            ref={videoRef}
            src={reel.url}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
            playsInline
            loop
            onClick={handleVideoClick}
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="absolute -bottom-8 right-0">
            <button className="font-serif px-2 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] text-white">mention</button>
          </div>
          <AlertDialogCancel className="absolute -bottom-8 right-24 text-white px-2">
            <IoChevronBackSharp />
          </AlertDialogCancel>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {selectedProfilePics.map((profilePic, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Image
                  src={profilePic.photo}
                  width={30}
                  height={30}
                  alt={profilePic.username}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="bg-black text-white p-4 rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={profilePic.photo}
                    width={60}
                    height={60}
                    alt={profilePic.username}
                    className="rounded-full mb-2"
                  />
                  <span className="text-lg font-bold">{profilePic.username}</span>
                  <div className="flex items-center justify-between w-full gap-2">
                    <Link href={`/profile/${profilePic.username}`}>
                      <Button className="w-24 mt-2 flex items-center justify-center">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      className="w-24 mt-2 flex items-center justify-center"
                      onClick={() => handleUserClick(profilePic)}
                    >
                      <SendHorizontal />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
          {hiddenProfilePics.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white cursor-pointer">
                  <span>{`+${hiddenProfilePics.length}`}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="bg-black text-white p-4 rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
                <div className="flex flex-col gap-2">
                  {hiddenProfilePics.map((pic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Image
                        src={pic.photo}
                        width={30}
                        height={30}
                        alt={pic.username}
                        className="rounded-full border-2 border-white cursor-pointer"
                        onClick={() => handleUserClick(pic)}
                      />
                      <div className="flex flex-col w-full">
                        <span className="text-sm">{pic.username}</span>
                        <div className="flex justify-between mt-4">
                          <Link href={`/profile/${pic.username}`}>
                            <Button className="w-20 flex p-5 items-center justify-center">
                              View
                            </Button>
                          </Link>
                          <Button
                            className="w-20 flex items-center justify-center"
                            onClick={() => handleUserClick(pic)}
                          >
                            <SendHorizontal />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
