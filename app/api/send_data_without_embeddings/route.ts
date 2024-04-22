import { connectToDatabase } from "@/lib/database/connectToDatabase";
import FullUser from "@/lib/database/models/fullUser.model";
import User from "@/lib/database/models/user.model"; 
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    try {
        const { clerkId, interests, location, reasonForJoining } = await req.json(); 

        connectToDatabase(); 

        const registeredUser = await User.findOne({ clerkId });

        if (!registeredUser) {
            throw new Error("User not found");
        }

        const { email, photo, firstName, lastName, username } = registeredUser;

        const user: User_with_interests_location_reason = {
            clerkId,
            email,
            username,
            firstName,
            lastName,
            photo,
            interests,
            location,
            reasonForJoining,
        };
        const updatedUser = await FullUser.create(user);

        return NextResponse.json({ updatedUser });
    } catch (error) {
        throw new Error("internal server error"); 
    }
}
