import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const embedding = searchParams.get("embedding");
        const queryVector: number[] | undefined = embedding?.split(',').map(Number); 

        const uri = process.env.MONGODB_URL as string;
        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db("dl");
        const collection = db.collection("movies");

        const documents = await collection.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryVector,
                    path: "embedding",
                    numCandidates: 150,
                    limit: 10,
                    index: "rabotai"
                },
            },
            {
                $project: {
                    title: 1,
                    _id: 0
                }
            }
        ]).toArray();

        await client.close();

        return NextResponse.json({ similar_docs: documents });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "error" });
    }
}
