import FullUser from "@/lib/database/models/fullUser.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const clerkId = searchParams.get("clerkId");

    const user = await FullUser.findOne({clerkId});

    return NextResponse.json(user);
}