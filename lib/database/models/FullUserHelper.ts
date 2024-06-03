import { Schema, model, models } from "mongoose";

const fullUserHelperSchema = new Schema({
  embedded_video: {
    type: [Number],
    required: true
  },
  videoId: {
    type: String,
    required: true
    }
});

const FullUserHelper = models?.FullUserHelper || model("FullUserHelper", fullUserHelperSchema);

export default FullUserHelper;
