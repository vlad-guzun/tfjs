"use client";
require("@tensorflow/tfjs");
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { movies } from "../lib/data/movies";
import StarterModal from "@/components/StarterModal";
import { currentUser } from '@clerk/nextjs/server';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';



export default function Home() {
  const [clerkId, setClerkId] = useState<string>();
  const [userDoc, setUserDoc] = useState<any>();
    //sterge aici async dac treb, dar pana ce lasal, oricum nu 
    const {user,isLoaded} = useUser();
    useEffect(() => {
      if(isLoaded && user) {
        setClerkId(user.id);
      }

    }, [user,isLoaded]);

    useEffect(() => {
        const check_if_the_modal_is_submitted_and_get_the_full_user = async () => {
            if (!clerkId) {return;}
            const user = await fetch(`/api/user?clerkId=${clerkId}`);
            const data = await user.json();
            setUserDoc(data);
            
        }
        check_if_the_modal_is_submitted_and_get_the_full_user();
    },[Cookies.get(`modalSubmitted_${clerkId}`) === "true"]);

    useEffect(() => {
      if (userDoc) {
        const embed_user_interests_location_reason_for_joining = async () => {
          const { clerkId, interests, location, reasonForJoining } = userDoc || {};
          const model = await use.load();
          const embeddings = await model.embed([interests, location, reasonForJoining]);
          const embedded_interests = embeddings.arraySync()[0];
          const embedded_location = embeddings.arraySync()[1];
          const embedded_reason_for_joining = embeddings.arraySync()[2];
          try{
          const response = await fetch("/api/save_to_db_embedded_user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId,
              embeddedInterests: embedded_interests,
              embeddedLocation: embedded_location,
              embeddedReasonForJoining: embedded_reason_for_joining,
            }),
          });
          if(response.ok){
            const data = await response.json();
            console.log(data);
          }
          else console.log(response.statusText + "raspuns nehorosii");
          } catch (error) {
              console.error(error);
          }
        };
        embed_user_interests_location_reason_for_joining();
      }
    }, [userDoc]);


  return (
    <div>
      <StarterModal clerkId={clerkId}/>
      <h1 className='text-4xl text-red-700'>{clerkId}</h1>
      <h1 className='text-4xl text-red-700'>{userDoc?.location}</h1>
      <h1 className='text-4xl text-red-700'>{userDoc?.interests}</h1>
      <h1 className='text-4xl text-red-700'>{userDoc?.reasonForJoining}</h1>
    </div>    
  );
}
