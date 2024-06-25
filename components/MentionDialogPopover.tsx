import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { useEffect, useState, useRef } from "react";
  import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
  import { AtSign, SendHorizontal } from "lucide-react";
  import { getAllUsers } from "@/lib/actions/user.action";
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
  import { MdArrowBackIosNew } from "react-icons/md";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { useUserStore } from "../hooks/useStore";
import { ContinuePreview } from "./ContinuePreview";
  
  export function MentionDialog({ reel, onMention }: { reel: VideoPostProps, onMention: (username: string) => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User_with_interests_location_reason[]>([]);
    const [playing, setPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedProfilePics, setSelectedProfilePics] = useState<User_with_interests_location_reason[]>([]);
    const [popoverUser, setPopoverUser] = useState<User_with_interests_location_reason | null>(null);
    const router = useRouter();
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  
    useEffect(() => {
      const fetchUsers = async () => {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      };
  
      fetchUsers();
    }, []);
  
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
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
  
    const handleProfileClick = (user: User_with_interests_location_reason) => {
      if (!selectedProfilePics.find(pic => pic.clerkId === user.clerkId)) {
        setSelectedProfilePics(prevPics => [...prevPics, user]);
      }
    };
  
    const handleUserClick = async (user: User_with_interests_location_reason) => {
      setSelectedUser(user);
      router.push("/inbox");
    };
  
    const visibleProfilePics = selectedProfilePics.slice(0, 3);
    const hiddenProfilePics = selectedProfilePics.slice(3);
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center mb-2 cursor-pointer hover:text-gray-400">
            <AtSign className="mr-2" size={15} />
            <p className="font-serif text-sm">mention</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-full sm:max-w-3xl mx-auto p-4 bg-black rounded-md shadow-lg border-none">
          <div className="flex w-full h-full bg-black">
            <div className="relative w-[66%] h-full">
              <video
                ref={videoRef}
                src={reel.url}
                className="w-[80%] h-[80%] mt-24 object-cover rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
                playsInline
                loop
                onClick={handleVideoClick}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                {visibleProfilePics.map((pic, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <img
                        src={pic.photo}
                        alt={`Selected Profile ${index}`}
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => setPopoverUser(pic)}
                      />
                    </PopoverTrigger>
                    {popoverUser && popoverUser.clerkId === pic.clerkId && (
                      <PopoverContent className="bg-black text-white p-4 rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] w-64">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={popoverUser.photo}
                            alt={popoverUser.username}
                            className="w-16 h-16 rounded-full mb-2"
                          />
                          <span className="text-lg font-bold">{popoverUser.username}</span>
                          <div className="flex items-center justify-between w-full gap-2">
                            <Link href={`/profile/${popoverUser.username}`}>
                              <Button className="w-24 mt-2 flex items-center justify-center">
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              className="w-24 mt-2 flex items-center justify-center"
                              onClick={() => handleUserClick(popoverUser)}
                            >
                              <SendHorizontal />
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    )}
                  </Popover>
                ))}
                {hiddenProfilePics.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="w-8 h-10 rounded-full flex justify-center items-center cursor-pointer ">
                        <span className="text-white">{`+${hiddenProfilePics.length}`}</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="bg-black text-white p-4 rounded-md shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] w-64">
                      <div className="flex flex-col gap-2">
                        {hiddenProfilePics.map((pic, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <img
                              src={pic.photo}
                              alt={`Hidden Profile ${index}`}
                              className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                              onClick={() => setPopoverUser(pic)}
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
            </div>
            <div className="w-[34%] pl-4 flex flex-col justify-start h-full bg-black">
              <Command className="w-full h-full flex flex-col bg-black text-white">
                <div className="flex justify-between mb-2">
                  <AlertDialogCancel className="text-white border-none bg-transparent bg-black hover:bg-black hover:text-slate-400 p-2 rounded-md">
                    <MdArrowBackIosNew />
                  </AlertDialogCancel>
                </div>
                <CommandInput
                  placeholder="@ in reel"
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="w-full text-sm h-10 mb-2 bg-black text-white"
                  style={{ fontSize: "0.75rem" }}
                />
                <CommandList className="flex-1 overflow-y-auto bg-black">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: User_with_interests_location_reason) => (
                      <CommandItem
                        key={user.clerkId}
                        onSelect={() => {
                          onMention(user.username);
                          handleProfileClick(user);
                        }}
                        className="flex items-center cursor-pointer hover:bg-gray-700 p-2"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <img src={user.photo} width={20} height={20} alt={user.username} className="rounded-full mr-2" />
                        {user.username}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandEmpty style={{ fontSize: "0.75rem" }}>No users found.</CommandEmpty>
                  )}
                </CommandList>
                <div>
                  <ContinuePreview reel={reel} selectedProfilePics={selectedProfilePics}/>
                </div>
              </Command>
            </div>
          </div>
          <style jsx>{`
            video::-webkit-media-controls-panel {
              display: none !important;
            }
  
            video::-webkit-media-controls-play-button,
            video::-webkit-media-controls-volume-slider,
            video::-webkit-media-controls-timeline-container,
            video::-webkit-media-controls-current-time-display,
            video::-webkit-media-controls-time-remaining-display,
            video::-webkit-media-controls-fullscreen-button {
              display: none !important.
            }
          `}</style>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  