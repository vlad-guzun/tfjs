import { NextResponse } from "next/server";

export async function POST(req: Request){
    const { clerkId, interests, location, reasonForJoining } = await req.json();
    return NextResponse.json({ clerkId, interests, location, reasonForJoining });
}