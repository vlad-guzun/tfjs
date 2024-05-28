import { Schema, model, models } from "mongoose";

const StartReelSchema = new Schema({
    reel: String,
    title: String,
    id: String
});

const StartReel = models?.StartReel || model("StartReel", StartReelSchema);

export default StartReel;