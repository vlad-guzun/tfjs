import React from "react";

interface MessageProps {
  message: {
    senderId: string;
    text: string;
    reaction?: string;
  };
  index: number;
  loggedInUserId: string | undefined;
  selectedUsername: string;
  isEmojiPickerVisible: number | null;
  handleEmojiClick: (emoji: string, index: number) => void;
  setEmojiPickerVisible: React.Dispatch<React.SetStateAction<number | null>>;
}

const emojis = ["😀", "❤️", "👍"];

const Message: React.FC<MessageProps> = ({
  message,
  index,
  loggedInUserId,
  selectedUsername,
  isEmojiPickerVisible,
  handleEmojiClick,
  setEmojiPickerVisible,
}) => {
  return (
    <div
      className={`message ${message.senderId === loggedInUserId ? "sent" : "received"}`}
      onMouseEnter={() => setEmojiPickerVisible(index)}
      onMouseLeave={() => setEmojiPickerVisible(null)}
    >
      <span className="sender">{message.senderId === loggedInUserId ? "" : selectedUsername}</span>
      {message.text}
      {message.reaction && (
        <div className="emoji-icon">
          {message.reaction}
        </div>
      )}
      {isEmojiPickerVisible === index && (
        <div className="emoji-picker-container" style={{ left: message.senderId === loggedInUserId ? 'auto' : '100%', right: message.senderId === loggedInUserId ? '100%' : 'auto' }}>
          {emojis.map((emoji, i) => (
            <span key={i} onClick={() => handleEmojiClick(emoji, index)}>{emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
