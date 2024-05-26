import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { getAllCommentsFromAVideo, writeComment } from "@/lib/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { CommentOptionPopover } from "./CommentOptionPopover"; 
import { IoHeart } from "react-icons/io5";
import { Textarea } from "./ui/textarea";
import EmojiPicker, { EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';

type CommentProps = {
  comment: string;
  commenter_id: string;
  commenter_photo: string;
  createdAt: Date;
};

export function CommentsScrollArea({
  videoId,
  following,
}: {
  videoId: string;
  following: User_with_interests_location_reason;
}) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [likedComments, setLikedComments] = useState<{[key: number]: boolean}>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getAllCommentsFromAVideo(videoId, following?.clerkId);
      setComments(comments);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };
    fetchComments();
  }, [videoId, following?.clerkId]);

  const handleCommentSubmit = async () => {
    if (!comment) return;
    await writeComment(videoId, user?.id, comment, user?.imageUrl, following?.clerkId);
    setComment("");
    const updatedComments = await getAllCommentsFromAVideo(videoId, following?.clerkId);
    setComments(updatedComments);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.style.paddingBottom = "4rem"; 
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [comments]);

  const toggleLike = (index: number) => {
    setLikedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false); 
  };

  const handleCopyComment = (comment: string) => {
    navigator.clipboard.writeText(comment);
    alert('Comment copied to clipboard');
  };

  return (
    <div className="relative h-72 w-full rounded-md border bg-black border-none">
      <ScrollArea ref={scrollAreaRef} className="h-full bg-black text-white pb-20">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Comments</h4>
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 relative group">
              <div className="flex gap-3 items-start">
                <div className="relative flex-grow text-sm break-words max-w-[220px]">
                  <Image
                    src={comment.commenter_photo!}
                    alt="commenter"
                    width={15}
                    height={15}
                    className="absolute top-0 left-0 rounded-full"
                  />
                  <div className="ml-6 font-serif">
                    {comment.comment}
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <IoHeart 
                    size={13} 
                    color={likedComments[index] ? "red" : "white"} 
                    className="cursor-pointer"
                    onClick={() => toggleLike(index)}
                  />
                  <div className="">
                    <CommentOptionPopover  />
                  </div>
                </div>
              </div>
              {index < comments.length - 1 && (
                <Separator className="w-full my-2 mt-2 border border-slate-800" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 bg-black border-t p-2">
        <div className="flex items-center space-x-2">
          <Button className="flex-shrink-0" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            😁
          </Button>
          <Input
            className="w-full bg-black text-white border border-slate-800 resize-none max-h-10 font-serif overflow-auto scrollbar-hide"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button className="flex-shrink-0" onClick={handleCommentSubmit}>
            <Plus size={20} color="white" className="hover:text-slate-600" />
          </Button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-2 z-50 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.TWITTER} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
