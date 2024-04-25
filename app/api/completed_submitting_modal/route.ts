import { connectToDatabase } from "@/lib/database/connectToDatabase";
import CompletionOfModal from "@/lib/database/models/completionOfModal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    const searchParams = req.nextUrl.searchParams;
    const clerkId = searchParams.get("clerkId");

    await connectToDatabase();

    const submittedModalState = await new CompletionOfModal({
        clerkId,
        completed: "yes"
    }).save();
    

    return NextResponse.json({submittedModalState});
}