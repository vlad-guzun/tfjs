import { Schema, model, models } from "mongoose";

const FullUserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
    interests: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    reasonForJoining: {
        type: String,
        required: true,
    },
    following: {
        type: [String], // array of clerkIds 
    },
    feedback: {
      type: [
        {
          recipient: String,
          sentiment: Number
        }
      ]
    },
    text_posts: {
      type: [
        {
          title: String,
          description: String,
          profile_photo: String,
          createdAt: {
            type: Date,
            default: Date.now()
          }
        }
      ]
    },
    video_posts: {
      type: [
        {
          title: String,
          url: String,
          profile_photo: String,
          video_id: String,
          embedded_video:  [Number],
          comments: [
            {
              commenter: String,
              commenter_photo: String,
              comment: String,
              createdAt: {
                type: Date,
                default: Date.now()
              }
            }
          ],
          createdAt: {
            type: Date,
            default: Date.now()
          }
        }
      ]
    },
    lastSeen: {
      type: Date,
    },
    inbox: {
      type: [String], // array of clerkIds
    }

});

const FullUser = models?.FullUser || model("FullUser", FullUserSchema);

export default FullUser;