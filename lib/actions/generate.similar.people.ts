"use server";

import { MongoClient } from "mongodb";
import FullUser from "../database/models/fullUser.model";
import { connectToDatabase } from "../database/connectToDatabase";
import EmbeddedReel from "../database/models/embedded.reels";

export async function findSimilarPeople( embedding: Number[]) {
    
    const uri = process.env.MONGODB_URL as string;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("dl");
    const collection = db.collection("embeddedusers");

    const similarDocs = await collection.aggregate([
        {
            $vectorSearch: {
                queryVector: embedding,
                path: "embeddedInterests",
                numCandidates: 6,
                limit: 6,
                index: "default"
            },
        },
        {
            $project: {
                clerkId: 1,
                _id: 0
            }
        }
    ]).toArray();

    await connectToDatabase(); 
    const found_people = await FullUser.find({ clerkId: { $in: similarDocs.map(doc => doc.clerkId) } });
    return JSON.parse(JSON.stringify(found_people));
    
    
}

//reels_index
export async function save_embedded_reels(reels: any[]) {
  try {
    await connectToDatabase();
    
    const newReels: any[] = [];

    for (const reel of reels) {
      const existingReel = await EmbeddedReel.findOne({ videoId: reel.videoId });
      
      if (!existingReel) {
        newReels.push(reel);
      }
    }

    if (newReels.length > 0) {
      const embeddedReels = await EmbeddedReel.create(newReels);
      return JSON.parse(JSON.stringify({ status: 'success', data: embeddedReels }));
    } else {
      return JSON.parse(JSON.stringify({ status: 'success', data: [], message: 'No new reels to add' }));
    }
  } catch (error) {
    console.error('Error generating reels:', error);
    return JSON.parse(JSON.stringify({ status: 'error', message: 'Error generating reels' }));
  }
}

export async function recommend_reels(embedding: Number[]){
    try{
          const uri = process.env.MONGODB_URL as string;
          const client = new MongoClient(uri);
          await client.connect();

          const db = client.db("dl");
          const collection = db.collection("embeddedreels");

          const similarReels = await collection.aggregate([
              {
                  $vectorSearch: {
                      queryVector: embedding,
                      path: "embedding",
                      numCandidates: 6,
                      limit: 6,
                      index: "reels_index"
                  },
              },
              {
                  $project: {
                      videoId: 1,
                      _id: 0
                  }
              }
          ]).toArray();

          return JSON.parse(JSON.stringify(similarReels));

    }catch(err){
        console.error('Error generating reels:', err);
    }
}


