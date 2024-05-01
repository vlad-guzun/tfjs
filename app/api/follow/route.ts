import { connectToDatabase } from "@/lib/database/connectToDatabase";
import FullUser from "@/lib/database/models/fullUser.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request){
    const data = await req.json();
    const {clerkId, user_to_follow} = data;

    await connectToDatabase();

    const find_user = await FullUser.findOne({clerkId: clerkId});
    const {_id} = find_user;

    const user = await FullUser.findOneAndUpdate({_id}, {$push: {followers: user_to_follow}}, {new: true});

    return NextResponse.json({user});
}