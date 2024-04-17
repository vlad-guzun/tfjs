import { connectToDatabase } from "@/lib/database/connectToDatabase";
import Movie from "@/lib/models/movie.model";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    await connectToDatabase();
    const movies = await Movie.find({});
    return NextResponse.json(movies);
}
export async function POST(req: Request){
    const movies = await req.json();
    await connectToDatabase();
    await Movie.insertMany(movies);
    return NextResponse.json({message: "Movies saved!"});
}