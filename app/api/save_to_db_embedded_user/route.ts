import { connectToDatabase } from "@/lib/database/connectToDatabase";
import EmbeddedUser from "@/lib/database/models/embeddedUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request){
    const {clerkId, embeddedInterests, embeddedLocation, embeddedReasonForJoining} = await req.json();

    await connectToDatabase();

    const embeddedUser = new EmbeddedUser({
        clerkId,
        embeddedInterests,
        embeddedLocation,
        embeddedReasonForJoining,
    });

    await embeddedUser.save();
    

    return NextResponse.json(embeddedUser);
}