import { connectToDatabase } from "@/lib/database/connectToDatabase";
import EmbeddedUser from "@/lib/database/models/embeddedUser";
import {  NextResponse } from "next/server";

export async function POST(req: Request){
    const {embedding_data} = await req.json();

    const embeddedInterests = embedding_data[0];
    const embeddedLocation = embedding_data[1];
    const embeddedReasonForJoining = embedding_data[2];

    await connectToDatabase();

    const embedded_user = await EmbeddedUser.create({
        clerkId: "123",
        embeddedInterests,
        embeddedLocation,
        embeddedReasonForJoining,
    });



    return NextResponse.json(embedded_user);
}