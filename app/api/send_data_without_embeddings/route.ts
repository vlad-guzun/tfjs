import { connectToDatabase } from "@/lib/database/connectToDatabase";
import FullUser from "@/lib/database/models/fullUser.model";
import User from "@/lib/database/models/user.model"; 
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const clerkId = searchParams.get("clerkId");
        const interests = searchParams.get("interests");
        const location = searchParams.get("location");
        const reasonForJoining = searchParams.get("reasonForJoining");

        connectToDatabase();

        const registeredUser = await User.findOne({ clerkId });

        if (!registeredUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { email, photo, firstName, lastName, username } = registeredUser;

        const fullUser = {
            clerkId,
            interests,
            location,
            reasonForJoining,
            email,
            photo,
            firstName,
            lastName,
            username
        };
        const fullUserDoc = new FullUser(fullUser);
        await fullUserDoc.save();

        return NextResponse.json(fullUser);
    } catch (error) {
        NextResponse.json({ error}, { status: 500 });
    }
}
