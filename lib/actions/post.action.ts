"use server";

import { connectToDatabase } from "../database/connectToDatabase";
import FullUser from "../database/models/fullUser.model";

export async function createTextPost(input: string, textArea: string, clerkId: string | undefined) {
    try{
  
      await connectToDatabase();
      
      const user = await FullUser.findOne({clerkId});
      if(!user) throw new Error("User not found");

      const text_post = {
        title: input,
        description: textArea,
      }

      await user.text_posts.push(text_post);
      await user.save();

      return JSON.parse(JSON.stringify(user));
      
  
    }catch(error){
      console.log(error);
    }
  }
  