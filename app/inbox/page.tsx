"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GetYourInboxUsers } from "@/lib/actions/user.action";
import { fetchMessages, createMessage, notifyTyping } from "@/lib/actions/message.action";
import { useUser } from "@clerk/nextjs";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import pusherClient from "@/lib/pusher/pusherClient";
import dynamic from "next/dynamic";
import { BsEmojiGrinFill } from "react-icons/bs";
import useActiveList from "@/hooks/useActiveList";
import { PulsatingCircle } from "@/components/PulsingCircle";
import { EmojiStyle, Theme, EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Message {
  senderId: string;
  text: string;
  reaction?: string;
}

const emojis = ["😀", "❤️", "👍"];

const Inbox: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [inboxUsers, setInboxUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { user: loggedInUser } = useUser();
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); 
  const { members } = useActiveList();
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false); 

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null); 
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTypingIndicator = () => {
    if (typingIndicatorRef.current) {
      typingIndicatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(scrollToTypingIndicator, [otherUserTyping]); 

  const handleResize = (_event: Event, sizes: number[]) => {
    setIsCollapsed(sizes[0] <= 5);
  };

  useEffect(() => {
    const getYourInboxUsers = async () => {
      const users = await GetYourInboxUsers(loggedInUser?.id);
      setInboxUsers(users);
    };
    if (loggedInUser) {
      getYourInboxUsers();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedUser && loggedInUser) {
      const channelName = `conversation-${loggedInUser.id}-${selectedUser.clerkId}`;
      const channel = pusherClient.subscribe(channelName);

      const handleMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      const handleTypingEvent = (data: { senderId: string; status: string }) => {
        if (data.senderId !== loggedInUser?.id) {
          setOtherUserTyping(data.status === 'typing');
        }
      };

      channel.bind("new-message", handleMessage);
      channel.bind("typing", handleTypingEvent);

      return () => {
        channel.unbind("new-message", handleMessage);
        channel.unbind("typing", handleTypingEvent);
        pusherClient.unsubscribe(channelName);
      };
    }
  }, [selectedUser, loggedInUser]);

  const handleUserClick = async (user: any) => {
    setSelectedUser(user);
    if (loggedInUser && user) {
      const fetchedMessages = await fetchMessages(loggedInUser.id, user.clerkId);
      setMessages(fetchedMessages || []);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const senderId = loggedInUser?.id;
      const receiverId = selectedUser?.clerkId;

      if (senderId && receiverId) {
        await createMessage(senderId, receiverId, newMessage.trim());

        setMessages([...messages, { senderId, text: newMessage.trim() }]);
        setNewMessage("");
        setShowEmojiPicker(false);
        setEmojiPickerVisible(null);
        await notifyTyping(senderId, receiverId, 'stopped'); 
      }
    }
  };

  const handleEmojiClick = (emoji: string, index: number) => {
    const updatedMessages = messages.map((msg, idx) =>
      idx === index ? { ...msg, reaction: emoji } : msg
    );
    setMessages(updatedMessages);
    setEmojiPickerVisible(null); 
  };

  const triggerTypingEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (loggedInUser && selectedUser) {
      const senderId = loggedInUser.id;
      const receiverId = selectedUser.clerkId;

      await notifyTyping(senderId, receiverId, 'typing');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(async () => {
        await notifyTyping(senderId, receiverId, 'stopped'); 
      }, 3000);
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen"
      onResize={handleResize as any}
    >
      <ResizablePanel defaultSize={25} maxSize={50} minSize={0}>
        <div className={`flex flex-col h-full p-6 bg-black text-white ${isCollapsed ? "hidden" : "block"}`}>
          <style jsx>{`
            .scroll-container {
              height: calc(100vh - 64px); /* Adjust height to fit within the screen */
              overflow-y: auto;
              scroll-behavior: smooth; /* Enable smooth scrolling */
            }

            .scroll-container::-webkit-scrollbar {
              width: 0;
              background: transparent; /* Hide the scrollbar */
            }

            .scroll-container {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}</style>
          <div className="font-serif text-lg mb-4">{'People'}</div>
          <div className="scroll-container w-full">
            <ul className="flex flex-col items-start w-full">
              {inboxUsers.map((user) => {
                const isUserActive = members.indexOf(user.clerkId) !== -1;
                return (
                  <li
                    key={user.clerkId}
                    className={`py-4 cursor-pointer flex items-center w-full ${
                      selectedUser?.clerkId === user.clerkId ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className={`relative flex-none w-10 h-10 rounded-full overflow-visible ${selectedUser?.clerkId === user.clerkId ? "shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]" : ""}`}>
                      <img
                        src={user.photo}
                        alt={user.username}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {isUserActive && (
                        <div className="absolute -top-1 -right-2">
                          <PulsatingCircle />
                        </div>
                      )}
                    </div>
                    <span className="ml-4">{user.username}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} minSize={50} maxSize={100}>
        <div className="flex flex-col h-full p-6 bg-black text-white">
          {!selectedUser && (
            <p className="text-lg mb-4 font-serif text-center mt-[300px]">Select a chat to start messaging</p>
          )}
          {selectedUser && (
            <div className="scroll-container flex flex-col w-full">
              <style jsx>{`
                .scroll-container {
                  height: calc(100vh - 64px); /* Adjust height to fit within the screen */
                  overflow-y: auto;
                  scroll-behavior: smooth; /* Enable smooth scrolling */
                }

                .scroll-container::-webkit-scrollbar {
                  width: 0;
                  background: transparent; /* Hide the scrollbar */
                }

                .scroll-container {
                  -ms-overflow-style: none;  /* IE and Edge */
                  scrollbar-width: none;  /* Firefox */
                }

                .message {
                  padding: 10px;
                  border-radius: 10px;
                  max-width: 70%;
                  margin-bottom: 10px;
                  display: flex;
                  flex-direction: column;
                  position: relative;
                  cursor: pointer;
                }

                .message.sent {
                  background-color: #2f80ed;
                  color: white;
                  align-self: flex-end;
                }

                .message.received {
                  background-color: #e5e5ea;
                  color: black;
                  align-self: flex-start;
                }

                .message .sender {
                  font-size: 0.85rem;
                  font-weight: bold;
                  margin-bottom: 5px;
                }

                .typing-indicator {
                  display: flex;
                  align-items: center;
                  padding: 10px 0; /* Added padding to the Y-axis */
                }

                .typing-indicator span {
                  background-color: #ccc;
                  border-radius: 50%;
                  display: inline-block;
                  height: 8px;
                  margin: 0 2px;
                  width: 8px;
                }

                .typing-indicator span:nth-child(1) {
                  animation: typing 1s infinite;
                }

                .typing-indicator span:nth-child(2) {
                  animation: typing 1s infinite 0.2s;
                }

                .typing-indicator span:nth-child(3) {
                  animation: typing 1s infinite 0.4s;
                }

                @keyframes typing {
                  0% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-3px);
                  }
                  100% {
                    transform: translateY(0);
                  }
                }

                .emoji-picker-container {
                  display: flex;
                  flex-direction: column;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  background: transparent;
                  border-radius: 8px;
                  padding: 10px;
                  opacity: 0;
                  animation: fadeIn 0.5s forwards;
                }

                .emoji-picker-container span {
                  cursor: pointer;
                  font-size: 20px;
                  margin: 5px 0;
                  text-shadow: 0 0 10px rgba(255, 255, 255, 0.6); /* Adding shadow to the emoji */
                  opacity: 0;
                  animation: fadeIn 0.3s forwards;
                }

                .emoji-picker-container span:nth-child(1) {
                  animation-delay: 0.1s;
                }

                .emoji-picker-container span:nth-child(2) {
                  animation-delay: 0.2s;
                }

                .emoji-picker-container span:nth-child(3) {
                  animation-delay: 0.3s;
                }

                @keyframes fadeIn {
                  to {
                    opacity: 1;
                  }
                }
              `}</style>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.senderId === loggedInUser?.id ? "sent" : "received"}`}
                  onMouseEnter={() => setEmojiPickerVisible(index)}
                  onMouseLeave={() => setEmojiPickerVisible(null)}
                >
                  <span className="sender">{message.senderId === loggedInUser?.id ? "" : selectedUser.username}</span>
                  {message.text}
                  {message.reaction && (
                    <div className="emoji-icon">
                      {message.reaction}
                    </div>
                  )}
                  {isEmojiPickerVisible === index && (
                    <div className="emoji-picker-container" style={{ left: message.senderId === loggedInUser?.id ? 'auto' : '100%', right: message.senderId === loggedInUser?.id ? '100%' : 'auto' }}>
                      {emojis.map((emoji, i) => (
                        <span key={i} onClick={() => handleEmojiClick(emoji, index)}>{emoji}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {otherUserTyping && (
                <div className="typing-indicator" ref={typingIndicatorRef}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          {selectedUser && (
            <form
              className="flex items-center mt-auto border-t border-t-slate-900 relative"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <BsEmojiGrinFill size={20} />
              </button>
              {showEmojiPicker && (
                <div style={{ position: "absolute", bottom: "50px", left: "50px" }}>
                  <EmojiPicker
                    onEmojiClick={(emojiObject: EmojiClickData) => setNewMessage(newMessage + emojiObject.emoji)}
                    emojiStyle={EmojiStyle.APPLE}
                    theme={Theme.DARK}
                  />
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={triggerTypingEvent}
                className="flex-1 px-4 py-2 text-white rounded-l-md bg-black"
                placeholder="Send a message..."
              />
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-r-md"
              >
                <SendHorizontal className="hover:text-slate-400" />
              </button>
            </form>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Inbox;
