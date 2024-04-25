"use client";
require("@tensorflow/tfjs");
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { movies } from "../lib/data/movies";
import StarterModal from "@/components/StarterModal";
import { currentUser } from '@clerk/nextjs/server';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';



export default function Home() {
  const [clerkId, setClerkId] = useState<string>();
  const [modalSubmitted, setModalSubmitted] = useState<boolean>(false);
    //sterge aici async dac treb, dar pana ce lasal, oricum nu 
    const {user,isLoaded} = useUser();
    useEffect(() => {
      if(isLoaded && user) {
        setClerkId(user.id);
      }

    }, [user,isLoaded]);

    useEffect(() => {
      if(modalSubmitted){
        const check_if_the_modal_is_submitted_and_get_the_full_user = async () => {
          const response = await fetch(`/api/check_modal_submitted?clerkId=${clerkId}`);
          if(response.ok){
            const user = await fetch(`/api/user?clerkId=${clerkId}`);
            const data = await user.json();
            console.log(data);
          }
        }
        check_if_the_modal_is_submitted_and_get_the_full_user();
      }
    },[modalSubmitted]);




  return (
    <div>
      <StarterModal clerkId={clerkId} setModalSubmitted={setModalSubmitted}/>
      <h1 className='text-4xl text-red-700'>{clerkId}</h1>
    </div>    
  );
}
