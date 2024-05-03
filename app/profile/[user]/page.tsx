"use client";

import { getFullUserByUsername } from '@/lib/actions/user.action';
import { useEffect, useState } from 'react';
import { SeparatorForProfile } from '@/components/Separator';

const Profile = ({params: {user}}: any) => {

  const [userProfile, setUserProfile] = useState<User_with_interests_location_reason>();

  useEffect(() => {
    const fetchUser = async () => {
      const userProfile = await getFullUserByUsername(user);
      console.log(userProfile);
      setUserProfile(userProfile);
    };
    fetchUser();
  },[]);

  return (
    <SeparatorForProfile userProfile={userProfile as User_with_interests_location_reason}/>
  )
}

export default Profile
