"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/connectToDatabase";
import FullUser from "../database/models/fullUser.model";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error);
  }
}

export async function getFullUserByUsername(username: string) {
  try {
    await connectToDatabase();

    const fullUser = await FullUser.findOne({ username });

    if (!username) throw new Error("User not found");

    return JSON.parse(JSON.stringify(fullUser));
  } catch (error) {
    console.log(error);
  }
}

export async function getFullUserByClerkId(clerkId: string) {
  try {
    await connectToDatabase();

    const fullUser = await FullUser.findOne({ clerkId });

    if (!clerkId) throw new Error("User not found");

    return JSON.parse(JSON.stringify(fullUser));
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFollowings(clerkId: string) {
  try{

    await connectToDatabase();
    
    const user = await FullUser.findOne({clerkId});
    if(!user) throw new Error("User not found");
    
    const followed_users = await FullUser.find({ clerkId: {$in: user.following}});
    
    return JSON.parse(JSON.stringify(followed_users));

  }catch(error){
    console.log(error);
  }
}

export async function getAllTheFollowingsTextPosts(clerkId: string | undefined){
  try{
    
    await connectToDatabase();

    const user = await FullUser.findOne({clerkId});
    if(!user) throw new Error("User not found");

    const followed_users = await FullUser.find({ clerkId: {$in: user.following}});

    const text_posts = followed_users.reduce((allPosts, followedUser) => {
      allPosts.push(...followedUser.text_posts);
      return allPosts;
    }, []);

    text_posts.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    return JSON.parse(JSON.stringify(text_posts));

  }catch(error){
    console.log(error);
  }
}

export async function getAllTheFollowingsVideoPosts(clerkId: string | undefined){
  try{
    
    await connectToDatabase();

    const user = await FullUser.findOne({clerkId});
    if(!user) throw new Error("User not found");

    const followed_users = await FullUser.find({ clerkId: {$in: user.following}});

    const video_posts = followed_users.reduce((allPosts, followedUser) => {
      allPosts.push(...followedUser.video_posts);
      return allPosts;
    }, []);

    video_posts.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return JSON.parse(JSON.stringify(video_posts));

  }

  catch(error){
    console.log(error);
  }
}

export async function getAllVideosById(clerkId: string | undefined){
  try{
    
    await connectToDatabase();

    const user = await FullUser.findOne({clerkId});
    if(!user) throw new Error("User not found");
    console.log(user);
    return JSON.parse(JSON.stringify(user.video_posts));

  }catch(error){
    console.log(error);
  }
}

export async function updateLastSeen(clerkId: string, date: Date){
  try{
    await connectToDatabase();

    const updatedUser = await FullUser.findOneAndUpdate({clerkId}, {lastSeen: date}, {new: true});

    if(!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));

  }
  catch(error){
    console.log(error);
  }
}

export async function checkActivityOfAllUsers() {
  try {
    await connectToDatabase();

    const activeUsers = await FullUser.find({ lastSeen: { $exists: true } });

    if (!activeUsers.length) throw new Error("No active users found");

    return JSON.parse(JSON.stringify(activeUsers));
  } catch (error) {
    console.error(error);
    throw new Error("Error while checking activity of users");
  }
}