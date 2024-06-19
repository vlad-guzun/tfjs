"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GetYourInboxUsers } from "@/lib/actions/user.action";
import { fetchMessages, createMessage } from "@/lib/actions/message.action";
import { useUser } from "@clerk/nextjs";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface Message {
  senderId: string;
  text: string;
}

const Inbox: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User_with_interests_location_reason | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [inboxUsers, setInboxUsers] = useState<User_with_interests_location_reason[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { user: loggedInUser } = useUser();

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

  const handleUserClick = async (user: User_with_interests_location_reason) => {
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
      }
    }
  };

  const onResize = (event: any) => {
    const sizes = event.detail.sizes;
    handleResize(event, sizes);
  };

  useEffect(() => {
    const resizableGroup = document.querySelector('.h-screen');
    if (resizableGroup) {
      resizableGroup.addEventListener('resize', onResize);
    }
    return () => {
      if (resizableGroup) {
        resizableGroup.removeEventListener('resize', onResize);
      }
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen"
    >
      <ResizablePanel defaultSize={25} maxSize={50} minSize={0}>
        <div className={`flex flex-col h-full p-6 bg-black text-white ${isCollapsed ? "hidden" : "block"}`}>
          <style jsx>{`
            .scroll-container {
              height: calc(100vh - 64px); /* Adjust height to fit within the screen */
              overflow-y: auto;
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
          <div className="font-bold text-lg mb-4">{'Люди'}</div>
          <div className="scroll-container w-full">
            <ul className="flex flex-col items-start w-full">
              {inboxUsers.map((user) => (
                <li
                  key={user.clerkId}
                  className={`py-4 cursor-pointer flex items-center w-full ${
                    selectedUser?.clerkId === user.clerkId ? "bg-gray-700" : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className={`flex-none w-10 h-10 rounded-full overflow-hidden ${selectedUser?.clerkId === user.clerkId ? "shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]" : ""}`}>
                    <img
                      src={user.photo}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="ml-4">{user.username}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} minSize={50} maxSize={100}>
        <div className="flex flex-col h-full p-6 bg-black text-white">
          {!selectedUser && (
            <p className="font-bold text-lg mb-4">Выберите человека, чтобы просмотреть сообщения</p>
          )}
          {selectedUser && (
            <div className="scroll-container flex flex-col w-full">
              <style jsx>{`
                .scroll-container {
                  height: calc(100vh - 64px); /* Adjust height to fit within the screen */
                  overflow-y: auto;
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
              `}</style>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.senderId === loggedInUser?.id ? "sent" : "received"}`}>
                  <span className="sender">{message.senderId === loggedInUser?.id ? "Вы" : selectedUser.username}</span>
                  {message.text}
                </div>
              ))}
            </div>
          )}
          {selectedUser && (
            <form
              className="flex items-center mt-auto border-t border-t-slate-900"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 text-white rounded-l-md bg-black "
                placeholder="Введите сообщение..."
              />
              <button
                type="submit"
                className="px-4 py-2  text-white rounded-r-md"
              >
               <SendHorizontal className="hover:text-slate-400"/>
              </button>
            </form>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Inbox;
