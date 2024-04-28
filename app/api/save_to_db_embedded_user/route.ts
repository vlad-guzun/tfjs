import { connectToDatabase } from "@/lib/database/connectToDatabase";
import EmbeddedUser from "@/lib/database/models/embeddedUser";
import {  NextResponse } from "next/server";

export async function POST(req: Request){
    const {clerkId,embedding_data} = await req.json();
    

    const embeddedInterests = embedding_data[0];
    const embeddedLocation = embedding_data[1];
    const embeddedReasonForJoining = embedding_data[2];

    await connectToDatabase();
    const embeddedUser = await EmbeddedUser.create({clerkId,embeddedInterests,embeddedLocation,embeddedReasonForJoining});


    return NextResponse.json({embeddedUser});
}