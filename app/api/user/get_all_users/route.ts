import FullUser from "@/lib/database/models/fullUser.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const clerkIds = searchParams.get("clerkIds");

    const users = await FullUser.find({clerkId: {$in: clerkIds?.split(",")}});

    return NextResponse.json(users);
}