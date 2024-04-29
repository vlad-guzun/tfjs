import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();

    const {embedding_data} = data;

    const embedded_interests: number[] = embedding_data[0];

    const uri = process.env.MONGODB_URL as string;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("dl");
    const collection = db.collection("embeddedusers");


    const documents = await collection.aggregate([
        {
            $vectorSearch: {
                queryVector: embedded_interests,
                path: "embeddedInterests",
                numCandidates: 5,
                limit: 3,
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

    await client.close();


    return NextResponse.json(documents);
}
