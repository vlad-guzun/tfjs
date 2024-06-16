import { connectToDatabase } from "@/lib/database/connectToDatabase";
import FullUser from "@/lib/database/models/fullUser.model";
import { NextRequest, NextResponse } from "next/server";

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams;
  const username = data.get('username');

  if (!username) {
    return NextResponse.json({ searchResult: [] });
  }

  const sanitizedUsername = escapeRegExp(username);

  await connectToDatabase();
  const searchResult = await FullUser.find({ username: { $regex: sanitizedUsername, $options: 'i' } });

  return NextResponse.json({ searchResult });
}
