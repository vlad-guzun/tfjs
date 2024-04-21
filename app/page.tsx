require("@tensorflow/tfjs");
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { movies } from "../lib/data/movies";
import StarterModal from "@/components/StarterModal";
import { currentUser } from '@clerk/nextjs/server';



export default async function Home() {
    //sterge aici async dac treb, dar pana ce lasal, oricum nu 
    const user = await currentUser();
    const clerkId = user?.id;



  return (    
      <StarterModal clerkId={clerkId}/>
  );
}
