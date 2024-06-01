import { connectToDatabase } from "../database/connectToDatabase";
import FullUser from "../database/models/fullUser.model";

export async function getAllUsers(){

    try{
      
      await connectToDatabase();
  
      const users = await FullUser.find({});
      if(!users) throw new Error("User not found");
  
      return JSON.parse(JSON.stringify(users));
  
    }
    catch(error){
      console.log(error);
    }
  }