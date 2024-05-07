import FullUser from "@/lib/database/models/fullUser.model";
import { NextResponse } from "next/server";
const Sentiment = require('sentiment');

export async function PUT(req: Request){
  const data = await req.json();
  const {sender_of_feedback,recipient_of_feedback,feedback_content} = data;

    if(!sender_of_feedback || !recipient_of_feedback || !feedback_content){
        return NextResponse.json({error: "Please provide all required fields"}, {status: 400});
    } 
    else {
        try{
        const sentiment = new Sentiment();
        const result = sentiment.analyze(feedback_content);
        const sentiment_score = result.comparative;
        const feedback = {
            recipient: recipient_of_feedback,
            sentiment: sentiment_score
        }
        const user = await FullUser.findOne({clerkId: sender_of_feedback});
        if(!user){
            return NextResponse.json({error: "User not found"});
        }
        user.feedback.push(feedback);
        await user.save();
        return NextResponse.json({message: "Feedback sent successfully"});
    }catch(err){
        return NextResponse.json({error: err});
    }
    }
}