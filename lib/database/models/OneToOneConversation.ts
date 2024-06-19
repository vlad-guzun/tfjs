import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  participants: [{ type: String, required: true }],
  messages: [MessageSchema],
});

const Conversation = models?.Conversation || model("Conversation", ConversationSchema);

export default Conversation;
