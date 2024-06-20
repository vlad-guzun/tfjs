

const CustomEmojiPicker = ({ onEmojiClick }: {onEmojiClick: any}) => {
  const emojis = [
    { emoji: '😊', label: 'Smiling Face' },
    { emoji: '😂', label: 'Face with Tears of Joy' },
    { emoji: '❤️', label: 'Red Heart' },
    { emoji: '😍', label: 'Heart Eyes' },
    { emoji: '😘', label: 'Kissing Heart' },
    { emoji: '👍', label: 'Thumbs Up' },
    { emoji: '🙏', label: 'Folded Hands' }
  ];

  return (
    <div className="custom-emoji-picker">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          className="emoji-button"
          onClick={() => onEmojiClick(emoji)}
          aria-label={emoji.label}
        >
          {emoji.emoji}
        </button>
      ))}
      <style jsx>{`
        .custom-emoji-picker {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .emoji-button {
          font-size: 24px;
          border: none;
          background: none;
          cursor: pointer;
        }
        .emoji-button:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default CustomEmojiPicker;
