"use server";

import { connectToDatabase } from "../database/connectToDatabase";
import Conversation from "../database/models/OneToOneConversation";
import { pusherServer } from "../pusher";



export async function createMessage(senderId: string | undefined, receiverId: string | undefined, text: string) {
  try {
    await connectToDatabase();

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const message = { senderId, text };
    conversation.messages.push(message);
    await conversation.save();

    pusherServer.trigger(`conversation-${senderId}-${receiverId}`, 'new-message', message);
    pusherServer.trigger(`conversation-${receiverId}-${senderId}`, 'new-message', message);


    return JSON.parse(JSON.stringify({ message: 'Message sent' }));
  } catch (err) {
    console.error(err);
  }
}


  export async function fetchMessages(senderId: string | undefined, receiverId: string | undefined) {
    try {
      await connectToDatabase();
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      if (!conversation) {
        throw new Error("No conversation found between the users.");
      }
  
      return JSON.parse(JSON.stringify(conversation.messages));
    } catch (err) {
      console.error(err);
    }
  }