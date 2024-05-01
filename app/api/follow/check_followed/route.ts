import FullUser from "@/lib/database/models/fullUser.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const clerkId = searchParams.get("clerkId");
    const user_to_follow = searchParams.get("user_to_follow");

    const check_if_followed = await FullUser.findOne({clerkId: clerkId, following: user_to_follow});

    return NextResponse.json({userFollowed: check_if_followed ? true : false});
}