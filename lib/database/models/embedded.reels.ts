import { Schema, model, models } from "mongoose";

const EmbeddedReelSchema = new Schema({
    videoId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const EmbeddedReel = models?.EmbeddedReel || model("EmbeddedReel", EmbeddedReelSchema);

export default EmbeddedReel;