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
  const [remommandedUsers, setRemommandedUsers] = useState<User_with_interests_location_reason[]>();
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

          //eu is un geniu si am salvat aprox 7-8 sec , amu ii treb vro 15 sec in loc de minim 20
          async function process_data_in_parallel(string: string, backend: string){
              tf.setBackend(backend);              
              const tensor = await model.embed(string);
              return tensor.arraySync()[0];
          }
          const promises = [
            process_data_in_parallel(interests, "webgl"),
            process_data_in_parallel(location, "cpu"),
            process_data_in_parallel(reasonForJoining, "webgl")
          ]
          const embedding_data = await Promise.all(promises);
          try{
          const response = await fetch("/api/save_to_db_embedded_user", { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId,
              embedding_data
            }),
          });
          if(response.ok){
            const data = await response.json();
            console.log(data);
            const response2 = await fetch("/api/get_recommendations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                embedding_data
              }),
            });
            const ids = await response2.json();
            const response3 = await fetch(`/api/user/get_all_users?clerkIds=${ids.map((id: any) => id.clerkId).join(",")}`);
            const users = await response3.json();
            setRemommandedUsers(users);
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
      {
        remommandedUsers?.map((user) => (
          <div key={user.clerkId}>
            <h1>{user.username}</h1>
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.email}</p>
            <p>{user.location}</p>
            <p>{user.interests}</p>
            <p>{user.reasonForJoining}</p>
          </div>
        ))
      }
    </div>    
  );
}
