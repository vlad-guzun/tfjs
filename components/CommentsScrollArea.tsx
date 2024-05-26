import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { getAllCommentsFromAVideo, writeComment } from "@/lib/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { Heart, Plus } from "lucide-react";
import { Button } from "./ui/button";

type CommentProps = {
  comment: string;
  commenter_id: string;
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
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getAllCommentsFromAVideo(videoId, following?.clerkId);
      setComments(comments);
    };
    fetchComments();
  }, [videoId, following?.clerkId]);

  const handleCommentSubmit = async () => {
    if (!comment) return;
    await writeComment(videoId, user?.id, comment, following?.clerkId);
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
    }
  }, []);

  return (
    <div className="relative h-72 w-full rounded-md border bg-black border-none">
      <ScrollArea ref={scrollAreaRef} className="h-full bg-black text-white pb-20">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Comments</h4>
          {comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start gap-3">
                <div className="text-sm break-words max-w-[150px]">
                  {comment.comment}
                </div>
                <Heart size={15} color="white" className="hover:text-red-500" />
              </div>
              <Separator className="w-full my-2 mt-2 border border-slate-800" />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 bg-black border-t p-2">
        <div className="flex items-center space-x-2">
          <Input
            className="w-full bg-black text-white border border-slate-800"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button className="flex-shrink-0" onClick={handleCommentSubmit}>
            <Plus size={20} color="white" className="hover:text-slate-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
