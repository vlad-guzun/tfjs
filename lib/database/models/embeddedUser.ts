import { Schema, model, models } from "mongoose";

const EmbeddedUserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    embeddedInterests: {
        type: [Number],
        required: true,
    },
    embeddedLocation: {
        type: [Number],
        required: true,
    },
    embeddedReasonForJoining: {
        type: [Number],
        required: true,
    
    }
});

const EmbeddedUser = models?.EmbeddedUser || model("EmbeddedUser", EmbeddedUserSchema);

export default EmbeddedUser;