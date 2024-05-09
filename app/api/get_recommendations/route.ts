import EmbeddedUser from "@/lib/database/models/embeddedUser";
import FullUser from "@/lib/database/models/fullUser.model";
import { ConnectionClosedEvent, MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const LIMIT_NUM_CANDIDATES: number = 12;
const LIMIT: number = 6;

export async function POST(req: Request) {
    const data = await req.json();

    const { embedding_data, clerkId } = data;

    const embedded_interests: number[] = embedding_data[0];

    const uri = process.env.MONGODB_URL as string;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("dl");
    const collection = db.collection("embeddedusers");

    const user = await FullUser.findOne({ clerkId });
    const { feedback } = user;

    if (feedback) {
        const recipients_ids = feedback.map((item: any) => item.recipient);
        const recipients = await FullUser.find({ clerkId: { $in: recipients_ids } });

        let recommendedDocuments: any[] = [];
        let similarDocuments: any[] = [];

        for (const recipient of recipients) {
            const recipient_embeddings = await EmbeddedUser.findOne({ clerkId: recipient.clerkId });
            const recipient_interests = recipient_embeddings.embeddedInterests;

            const similarDocs = await collection.aggregate([
                {
                    $vectorSearch: {
                        queryVector: recipient_interests,
                        path: "embeddedInterests",
                        numCandidates: LIMIT_NUM_CANDIDATES,
                        limit: LIMIT,
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

            similarDocuments = similarDocuments.concat(similarDocs);
        }

        const similarIds = similarDocuments.map(doc => doc.clerkId);

        const similarFeedbackDocuments = await collection.aggregate([
            {
                $match: {
                    clerkId: { $in: similarIds, $ne: clerkId }
                }
            },
            {
                $addFields: {
                    averageFeedback: {
                        $avg: "$feedback.sentiment"
                    }
                }
            },
            {
                $sort: {
                    averageFeedback: -1
                }
            },
            {
                $limit: LIMIT
            }
        ]).toArray();

        recommendedDocuments = recommendedDocuments.concat(similarFeedbackDocuments);

        const remainingLimit = LIMIT - similarFeedbackDocuments.length;

        if (remainingLimit > 0) {
            const additionalDocuments = await collection.aggregate([
                {
                    $match: {
                        clerkId: { $nin: similarIds, $ne: clerkId }
                    }
                },
                {
                    $limit: remainingLimit
                }
            ]).toArray();

            recommendedDocuments = recommendedDocuments.concat(additionalDocuments);
        }

        await client.close();

        return NextResponse.json(recommendedDocuments);
    } else {
        const documents = await collection.aggregate([
            {
                $vectorSearch: {
                    queryVector: embedded_interests,
                    path: "embeddedInterests",
                    numCandidates: LIMIT_NUM_CANDIDATES,
                    limit: LIMIT,
                    index: "default"
                },
            },
            {
                $project: {
                    clerkId: 1,
                    _id: 0
                }
            },

        ]).toArray();

        const docs_without_me = documents.filter((doc) => doc.clerkId !== clerkId);

        await client.close();

        return NextResponse.json(docs_without_me);
    }
}
