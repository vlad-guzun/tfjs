"use client";
import { getFullUserByClerkId } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect,useState } from "react";
import { SeparatorForPersonalProfile } from "@/components/SeparatorForPersonalProfile";

export default function MyProfile() {
  const user = useUser();
  const [personalProfile,setPersonalProfile] = useState<User_with_interests_location_reason>();

  useEffect(() => {
    if(user && user.user && user.user.id){
      const fetch_personal_profile = async () => {
        const personal_profile = await getFullUserByClerkId(user.user.id);
        setPersonalProfile(personal_profile);
    }
    fetch_personal_profile();    
  }
},[]);

  return (
    <SeparatorForPersonalProfile personalProfile={personalProfile as User_with_interests_location_reason}/>
  )
}


