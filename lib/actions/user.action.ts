"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/connectToDatabase";
import FullUser from "../database/models/fullUser.model";
import FullUserHelper from "../database/models/FullUserHelper";

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
  }
}

export async function getAllPersonsYouFollow(clerkId: string | undefined){

  try{
    
    await connectToDatabase();

    const user = await FullUser.findOne({clerkId});
    if(!user) throw new Error("User not found");

    const followed_users = await FullUser.find({ clerkId: {$in: user.following}});
    return JSON.parse(JSON.stringify(followed_users));

  }
  catch(error){
    console.log(error);
  }
}



export async function getAllUsers() {
  try {
    await connectToDatabase();

    // Fetch all users
    const users = await FullUser.find({});
    if (!users) throw new Error("Users not found");

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
    return [];
  }
}

//ALT UNDEVA NU MERGE! VEZ HUINEAUA ASTA CUMVA, DACA O MUTO IN reel.recommendation.action.ts, NU MERGE MONGOURL nu e defined!
export async function getAllReels() {
  try {
    
    await connectToDatabase();
    
    const users = await getAllUsers();
    const allReels = users.flatMap((user:User_with_interests_location_reason) => user.video_posts || []);

    return JSON.parse(JSON.stringify(allReels));
    
  } catch (error) {
    console.log(error);
    return [];
  }
}

// export async function updateFullUserWithEmbedding(clerkId: string, videoId: string, embedding: number[]) {
//   try {
//     await connectToDatabase();

//     const updatedUser = await FullUser.findOneAndUpdate(
//       { clerkId, "video_posts.video_id": videoId },
//       { $set: { "video_posts.$.embedding": embedding } },
//       { new: true }
//     );

//     if (!updatedUser) throw new Error("User update failed");

//     return JSON.parse(JSON.stringify(updatedUser));
//   } catch (error) {
//     console.log(error);
//   }
// }

interface embeddingProps {
  videoId: string;
  embedding: number[];
}
export async function update_all_the_video_in_fulluser_with_its_embedding(embeddings: embeddingProps[]) {
  try {
    await connectToDatabase();
    console.log("Database connected.");

    console.log("Embeddings to update:", embeddings);

    for (const embedding of embeddings) {
      const user = await FullUser.findOne({ "video_posts.video_id": embedding.videoId });
      console.log(`User found for videoId ${embedding.videoId}:`, user);

      let userUpdated = false;
      if (user) {
        const videoPost = user.video_posts.find((post: any) => post.video_id === embedding.videoId);
        if (videoPost) {
          if (videoPost.embedded_video && videoPost.embedded_video.length === 512) {
            console.log(`Skipping update for videoId ${embedding.videoId} in FullUser as it already has a valid embedding.`);
          } else {
            const updateResult = await FullUser.updateOne(
              { "video_posts.video_id": embedding.videoId },
              { $set: { "video_posts.$.embedded_video": embedding.embedding } }
            );
            userUpdated = true;
            console.log(`Update result for videoId ${embedding.videoId} in FullUser:`, updateResult);
          }
        }
      } else {
        console.log(`No user found with videoId ${embedding.videoId} in FullUser.`);
      }

      const helper = await FullUserHelper.findOne({ videoId: embedding.videoId });
      let helperUpdated = false;
      if (helper) {
        if (helper.embedded_video && helper.embedded_video.length === 512) {
          console.log(`Skipping update for videoId ${embedding.videoId} in FullUserHelper as it already has a valid embedding.`);
        } else {
          const helperUpdateResult = await FullUserHelper.updateOne(
            { videoId: embedding.videoId },
            { $set: { embedded_video: embedding.embedding } }
          );
          helperUpdated = true;
          console.log(`Update result for videoId ${embedding.videoId} in FullUserHelper:`, helperUpdateResult);
        }
      } else {
        const newHelper = new FullUserHelper({
          videoId: embedding.videoId,
          embedded_video: embedding.embedding,
        });
        await newHelper.save();
        helperUpdated = true;
        console.log(`New helper created for videoId ${embedding.videoId}:`, newHelper);
      }

      if (userUpdated || helperUpdated) {
        console.log(`Successfully updated embeddings for videoId ${embedding.videoId}.`);
      } else {
        console.log(`No updates needed for videoId ${embedding.videoId}.`);
      }
    }

    console.log("All relevant users and helpers updated with video embeddings.");
    return JSON.parse(JSON.stringify(embeddings));
  } catch (error) {
    console.error("Error updating users with video embeddings:", error);
  }
}



export async function getReelsAndAssociatedInfoForRender(videoIds: any) {
  try {
    await connectToDatabase();
    console.log("Database connected.");

    const ids = videoIds.map((idObj:any) => String(idObj.videoId));

    const fullUsers = await FullUser.find({ "video_posts.video_id": { $in: ids } });

    if (!fullUsers || fullUsers.length === 0) {
      throw new Error("No users found with the provided video IDs");
    }

    const reelsWithInfo = fullUsers.flatMap(user => 
      user.video_posts
        .filter((post:any) => ids.includes(post.video_id))
        .map((post: any) => ({
          video: {
            title: post.title,
            url: post.url,
            profile_photo: post.profile_photo,
            video_id: post.video_id,
            embedded_video: post.embedded_video,
            comments: post.comments,
            createdAt: post.createdAt
          },
          user: {
            clerkId: user.clerkId,
            email: user.email,
            username: user.username,
            photo: user.photo,
            firstName: user.firstName,
            lastName: user.lastName,
            interests: user.interests,
            location: user.location,
            reasonForJoining: user.reasonForJoining,
            following: user.following,
            feedback: user.feedback,
            lastSeen: user.lastSeen
          }
        }))
    );

    return JSON.parse(JSON.stringify(reelsWithInfo));
  } catch (error) {
    console.error("Error fetching reels and associated info:", error);
    throw error;
  }
}

export async function addUserToInbox(clerkId: string | undefined, userToAdd: string | undefined) {
  try {
    await connectToDatabase();

    const user = await FullUser.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    const userToAddToInbox = await FullUser.findOne({ clerkId: userToAdd });
    if (!userToAddToInbox) throw new Error("User to add not found");

    const updatedUser = await FullUser.findOneAndUpdate(
      { clerkId },
      { $addToSet: { inbox: userToAdd } },
      { new: true }
    );

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
  }
}

export async function GetYourInboxUsers(clerkId: string | undefined) {
  try {
    await connectToDatabase();

    const user = await FullUser.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    const inboxUsers = await FullUser.find({ clerkId: { $in: user.inbox } });

    return JSON.parse(JSON.stringify(inboxUsers));
  } catch (error) {
    console.log(error);
  }
}