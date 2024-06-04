"use server";

import { MongoClient } from "mongodb";
import FullUser from "../database/models/fullUser.model";
import { connectToDatabase } from "../database/connectToDatabase";

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
export async function generate_similar_reels( embedding: Number[]) {
    
    const uri = process.env.MONGODB_URL as string;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("dl");
    const collection = db.collection("fulluserhelpers");

    const similarDocs = await collection.aggregate([
        {
            $vectorSearch: {
                queryVector: embedding,
                path: "embedded_video",
                numCandidates: 6,
                limit: 2,
                index: "helper"
            },
        },
        {
            $project: {
                videoId: 1,
                _id: 0
            }
        }
    ]).toArray();

    return JSON.parse(JSON.stringify(similarDocs));
}


