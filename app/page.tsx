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
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import {  Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import Link from "next/link";
 


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
            else {
              const user = await fetch(`/api/user?clerkId=${clerkId}`); 
              const data = await user.json();
              setUserDoc(data);
            }
            
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
    <div className="grid grid-cols-1 gap-10 mt-9">
      <StarterModal clerkId={clerkId} />
      {Cookies.get(`modalSubmitted_${clerkId}`) === "true" && (
        <div className="flex flex-wrap justify-center w-full">
          {remommandedUsers ? (
            remommandedUsers.map((recommended_user, index) => (
              <div key={index} className="mt-5 flex flex-col items-center justify-center mb-1 hover:border hover:border-slate-800">
                <div className="flex justify-center items-center w-72 h-[140px] bg-black rounded-lg relative mb-6 mr-6">
                  <div className="flex items-center justify-center relative">
                    <Image src={recommended_user.photo} className="mt-4 rounded-full border-2 border-slate-700" width={150} height={150} alt="user" />
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger className="border border-slate-800 text-white px-2 py-1 rounded-2xl hover:bg-white hover:text-black mb-[150px]">Choices</PopoverTrigger>
                  <PopoverContent className="border-slate-800 bg-black text-white flex flex-col items-center gap-4 mt-2">
                    <h3 className="text-center text-white mb-3">{recommended_user.username}</h3>
                    <div className="border-slate-800 bg-black text-white flex gap-4">
                      <Button className="w-full hover:bg-white hover:text-black bg-black border border-slate-800"><Link href={`/profile/${recommended_user.username}`}>Look</Link></Button>
                      <Button className="w-full hover:bg-white hover:text-black bg-black border border-slate-800" onClick={() => console.log("followed")}>Follow</Button>
                      <Button className="w-full hover:bg-white hover:text-black bg-black border border-slate-800">Message</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))
          ) : (
            Array.from({ length: 11 }, (_, index) => (
              <div key={index} className="flex justify-center items-center w-72 h-64 bg-black rounded-lg relative mb-6 mr-6">
                <Skeleton className="w-full h-full rounded-lg bg-gray-800 bg-opacity-45" />
              </div>
            ))
          )}
        </div>
      )}
    </div>

  );

}
