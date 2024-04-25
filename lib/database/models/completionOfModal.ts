import { Schema, model, models } from "mongoose";

const CompletionOfModalSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    completed: {
        type: String, 
        enum: ["yes", "no"], 
        required: true,
    }
});

const CompletionOfModal = models?.CompletionOfModal || model("CompletionOfModal", CompletionOfModalSchema);

export default CompletionOfModal;