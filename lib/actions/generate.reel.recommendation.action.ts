import { connectToDatabase } from "../database/connectToDatabase";

export async function generate_reels(){
    try{
        await connectToDatabase().then(() => {
            console.log('Connected to database');
        })


        return JSON.parse(JSON.stringify({ status: 'success', message: 'Connected to database'}) );

    }catch(error){
        console.error('Error generating screenshots:', error);
    }
}