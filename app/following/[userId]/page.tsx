"use client";
import Followings from "@/components/Followers";
import { getUserFollowings } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const FollowingPage = () => {
    const user = useUser();
    const [followings, setFollowings] = useState<User_with_interests_location_reason[]>([]);

    useEffect(() => {
        const fetchUserFollowings = async () => {
                    if(user && user.user && user.user.id){
                        const userFollowings = await getUserFollowings(user?.user?.id); 
                        setFollowings(userFollowings);
                    }
        }
        fetchUserFollowings();

    }, [user?.user?.id]); // ??? hz dc altcumva ii undefined

    return (
       <Followings followings={followings} />
    );
};

export default FollowingPage;
