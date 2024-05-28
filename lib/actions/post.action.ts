"use server";

import { connectToDatabase } from "../database/connectToDatabase";
import StartReel from "../database/models/Reel.model";
import FullUser from "../database/models/fullUser.model";
import {nanoid} from "nanoid";

export async function createTextPost(input: string, textArea: string, clerkId: string | undefined, profile_photo: string | undefined) {
    try{
  
      await connectToDatabase();
      
      const user = await FullUser.findOne({clerkId});
      if(!user) throw new Error("User not found");

      const text_post = {
        title: input,
        description: textArea,
        profile_photo: profile_photo
      }

      await user.text_posts.push(text_post);
      await user.save();

      return JSON.parse(JSON.stringify(user));
      
  
    }catch(error){
      console.log(error);
    }
  }

  export async function createVideoPost(title: string, url: string, clerkId: string | undefined, profile_photo: string | undefined) {
    try{
  
      await connectToDatabase();
      
      const user = await FullUser.findOne({clerkId});
      if(!user) throw new Error("User not found");

      const video_post = {
        title: title,
        url: url,
        video_id: nanoid(5),
        profile_photo: profile_photo
      }

      await user.video_posts.push(video_post);
      await user.save();

      return JSON.parse(JSON.stringify(user));
      
  
    }catch(error){
      console.log(error);
    }
  }

  export async function writeComment(videoId: string, commenter: string | undefined, comment: string, commenter_photo: string | undefined, user_which_received_comment: string | undefined) {
    try {
      await connectToDatabase();
  
      const user = await FullUser.findOne({ clerkId: user_which_received_comment });
      if (!user) throw new Error("User not found");
  
      const commentObj = {
        comment: comment,
        commenter_id: commenter,
        commenter_photo: commenter_photo,
        createdAt: new Date()
      };
  
      const updatedUser = await FullUser.findOneAndUpdate(
        { clerkId: user_which_received_comment, "video_posts.video_id": videoId },
        { $push: { "video_posts.$.comments": commentObj } },
        { new: true }
      );
  
      return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to write comment");
    }
  }
  
  export async function getAllCommentsFromAVideo(videoId: string, user_which_received_comment: string | undefined) {
    try {
      await connectToDatabase();
  
      const user = await FullUser.findOne({ clerkId: user_which_received_comment });
      if (!user) throw new Error("User not found");
  
      const video = user.video_posts.find((video:any) => video.video_id === videoId);
      if (!video) throw new Error("Video not found");
  
      return JSON.parse(JSON.stringify(video.comments));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get comments");
    }
  }

  export async function getAllTheUsers(){
    try{
      await connectToDatabase();
      const users = await FullUser.find({});
      return JSON.parse(JSON.stringify(users));
    }catch(error){
      console.log(error);
    }
  }

  export async function getAllReels() {
    try {
      await connectToDatabase();
  
      const users = await FullUser.find({});
      const reels = users.map((user) => user.video_posts).flat();
  
      return JSON.parse(JSON.stringify(reels));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get reels");
    }
  }

  export async function addStartReel(video: string,title: string,id: string){
    try{
      await connectToDatabase();
      const reel = new StartReel({
        reel: video,
        title: title,
        id: id
      });
      await reel.save();
      return JSON.parse(JSON.stringify(reel));
    }catch(error){
      console.log(error);
    }
  }