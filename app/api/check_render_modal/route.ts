import FullUser from "@/lib/database/models/fullUser.model";
import User from "@/lib/database/models/user.model";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest){   
    try{
        const searchParams = req.nextUrl.searchParams;
        const clerkId = searchParams.get("clerkId");

        if(await User.findOne({clerkId}) && await FullUser.findOne({clerkId})){
            return NextResponse.json({message: "don't render the starter modal"});
        }
        return NextResponse.json({message: "render the starter modal"});

    }catch(err){
        throw new Error("internal server error");
    }

    
}