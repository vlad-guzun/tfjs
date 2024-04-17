import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const movieQuery = await req.json();
        const uri = process.env.MONGODB_URL as string;

        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db("dl");
        const collection = db.collection("movies");

        const documents = await collection
            .aggregate([
                {
                    $vectorSearch: {
                        queryVector: movieQuery,
                        path: "embedding",
                        numCandidates: 50,
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
        // Close the MongoDB connection
        await client.close();
        console.log(documents);

        // Respond with a success message
        return NextResponse.json({ message: "Embedding received and saved to MongoDB!" });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({message: "error"});
    }
}
