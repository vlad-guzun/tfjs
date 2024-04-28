import { connectToDatabase } from "@/lib/database/connectToDatabase";
import EmbeddedUser from "@/lib/database/models/embeddedUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request){
    const {embedding_data} = await req.json();


    return NextResponse.json(embedding_data);
}