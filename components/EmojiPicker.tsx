import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import React from "react";

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  children: React.ReactNode;
}

const emojis = ["😀", "❤️", "👍"];

export const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ onEmojiClick, children }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-20 flex flex-col space-y-2">
        {emojis.map((emoji) => (
          <Button key={emoji} variant="ghost" onClick={() => onEmojiClick(emoji)}>
            {emoji}
          </Button>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};
