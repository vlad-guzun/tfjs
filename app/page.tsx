"use client";
import * as React from "react";
import * as tf from "@tensorflow/tfjs";
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import useActiveList from "@/hooks/useActiveList";
import { checkActivityOfAllUsers, updateLastSeen } from "@/lib/actions/user.action";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Eye, Heart, HeartCrack, UserPlus, UserMinus, SendHorizontal } from 'lucide-react';
import StarterModal from "@/components/StarterModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [clerkId, setClerkId] = useState<string>();
  const [userDoc, setUserDoc] = useState<any>();
  const [recommendedUsers, setRecommendedUsers] = useState<User_with_interests_location_reason[]>();
  const [followStatuses, setFollowStatuses] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [lastActiveAt, setLastActiveAt] = useState<Date | null>(null);
  const [activeUsers, setActiveUsers] = useState<User_with_interests_location_reason[]>([]);

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { members } = useActiveList();



  useEffect(() => {
    if (!user) {
      router.push("/start2");
    }
  },[user]);

  useEffect(() => {

    const getSession = async () => {
      if (user && isLoaded) {
        const sessions = await user.getSessions();
        console.log(sessions);

        const latestSession = sessions.reduce((latest: any, session: any) => {
          if (!latest || new Date(session.lastActiveAt) > new Date(latest.lastActiveAt)) {
            return session;
          }
          return latest;
        }, null);

        if (latestSession) {
          setLastActiveAt(new Date(latestSession.lastActiveAt));
          const lastActiveResponse: Date = await updateLastSeen(user?.id, new Date(latestSession.lastActiveAt));
          setLastActiveAt(lastActiveResponse);

          const active_users: User_with_interests_location_reason[] = await checkActivityOfAllUsers();
          setActiveUsers(active_users);
        }
      }
    };
    getSession();

    if (isLoaded && user) {
      setClerkId(user.id);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const checkIfModalSubmittedAndGetFullUser = async () => {
      if (!clerkId) return;
      const userResponse = await fetch(`/api/user?clerkId=${clerkId}`);
      const data = await userResponse.json();
      setUserDoc(data);
    };
    checkIfModalSubmittedAndGetFullUser();
  }, [clerkId]);

  useEffect(() => {
    if (userDoc) {
      const embedUserInterestsLocationReasonForJoining = async () => {
        const { clerkId, interests, location, reasonForJoining } = userDoc || {};
        const model = await use.load();

        async function process_data_in_parallel(string: string, backend: string) {
          tf.setBackend(backend);
          const tensor = await model.embed(string);
          return tensor.arraySync()[0];
        }

        const promises = [
          process_data_in_parallel(interests, "webgl"),
          process_data_in_parallel(location, "cpu"),
          process_data_in_parallel(reasonForJoining, "webgl")
        ];

        const embedding_data = await Promise.all(promises);

        try {
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

          if (response.ok) {
            const data = await response.json();
            const response2 = await fetch("/api/get_recommendations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                embedding_data,
                clerkId,
              }),
            });

            const ids = await response2.json();
            const response3 = await fetch(`/api/user/get_all_users?clerkIds=${ids.map((id: any) => id.clerkId).join(",")}`);
            const users = await response3.json();
            setRecommendedUsers(users);
          } else {
            console.log(response.statusText + "raspuns nehorosii");
          }
        } catch (error) {
          console.error(error);
        }
      };
      embedUserInterestsLocationReasonForJoining();
    }
  }, [userDoc]);

  useEffect(() => {
    if (clerkId && recommendedUsers) {
      recommendedUsers.forEach((recommended_user) => {
        const followStatusFromCookie = Cookies.get(`followStatus_${clerkId}_${recommended_user.clerkId}`);
        if (followStatusFromCookie) {
          setFollowStatuses((prevStatuses) => ({
            ...prevStatuses,
            [recommended_user.clerkId]: followStatusFromCookie,
          }));
        } else {
          setFollowStatuses((prevStatuses) => ({
            ...prevStatuses,
            [recommended_user.clerkId]: "follow",
          }));
        }
      });
    }
  }, [clerkId, recommendedUsers]);

  const handleFollow = async (clerkId: string | undefined, to_follow: string) => {
    const response = await fetch("/api/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId,
        user_to_follow: to_follow,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      Cookies.set(`followStatus_${clerkId}_${to_follow}`, "unfollow");
      setFollowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [to_follow]: "unfollow",
      }));
    } else {
      console.log("eroare");
    }
  };

  const handleUnfollow = async (clerkId: string | undefined, to_follow: string) => {
    const response = await fetch("/api/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId,
        user_to_follow: to_follow,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      Cookies.set(`followStatus_${clerkId}_${to_follow}`, "follow");
      setFollowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [to_follow]: "follow",
      }));
    } else {
      console.log("eroare");
    }
  };

  const send_feedback = async (sender_of_feedback: string | undefined, recipient_of_feedback: string, feedback_content: string) => {
    const response = await fetch("/api/send_feedback", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_of_feedback,
        recipient_of_feedback,
        feedback_content
      }),
    });
    if (response.ok) {
      const data = await response.json();
      Cookies.set(`feedback_${sender_of_feedback}_${recipient_of_feedback}`, "true");
      setFeedbackSent(true);
      setFeedback("");
      toast({
        description: `You will see more users like this`,
        style: {
          backgroundColor: "black",
          color: "white",
          border: "1px slate-800 solid",
          fill: "white",
        }
      })
    } else {
      console.log("eroare");
    }
  }

  useEffect(() => {
    setFeedbackSent(false);
  }, [feedbackSent]);

  function formatLastSeen(lastSeen: Date | null): React.JSX.Element | null {
    if (!lastSeen) {
      return <span className="text-white">inactive</span>;
    }

    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - lastSeenDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return <span className="bg-teal-500 px-3 py-1 rounded-xl text-white">{Math.floor(diffInSeconds)}s</span>;
    } else if (diffInSeconds < 3600) {
      return <span className="bg-teal-500 px-3 py-1 rounded-xl text-white">{Math.floor(diffInSeconds / 60)}m</span>;
    } else if (diffInSeconds < 43200) {
      return <span className="bg-teal-500 px-3 py-1 rounded-xl text-white">{Math.floor(diffInSeconds / 3600)}h</span>;
    }

    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-10 mt-9">
      <StarterModal clerkId={clerkId} />
      {Cookies.get(`modalSubmitted_${clerkId}`) === "true" && (
        <div className="flex flex-wrap justify-center w-full">
          {recommendedUsers ? (
            recommendedUsers.map((recommended_user, index) => {
              const isUserActive = members.indexOf(recommended_user.clerkId) !== -1;
              return (
                <div key={index} className="mt-5 flex flex-col items-center justify-center mb-1 ">
                  <div className="flex justify-center items-center w-72 h-[140px] bg-black rounded-lg relative mb-6 mr-6">
                    <div className="flex items-center justify-center relative">
                      <Image src={recommended_user.photo} className="mt-4 rounded-full border-2 border-slate-700" width={150} height={150} alt="user" />
                      {isUserActive ? (
                        <div className="absolute top-5 right-0 w-5 h-5 bg-green-600 rounded-full pulsating-dot"></div>
                      ) : (
                        <div className="absolute bottom-0 right-0 text-white text-xs p-1 rounded-md">
                          {recommended_user.lastSeen ? formatLastSeen(new Date(recommended_user.lastSeen)) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger className=" text-white px-2 py-1 rounded-2xl hover:bg-white hover:text-black mb-[150px]"><HiOutlineDotsHorizontal /></PopoverTrigger>
                    <PopoverContent className="border-slate-800 bg-black text-white flex flex-col items-center gap-4 mt-2">
                      <h3 className="text-center text-white mb-3">{recommended_user.username}</h3>
                      <div className="border-slate-800 bg-black text-white flex gap-4">
                        <Button className="w-full hover:bg-white hover:text-black bg-black border border-slate-800"><Link href={`/profile/${recommended_user.username}`}><Eye /></Link></Button>
                        <Button
                          className="w-full hover:bg-white hover:text-black bg-black border border-slate-800"
                          onClick={() => followStatuses[recommended_user.clerkId] === "follow" ? handleFollow(clerkId, recommended_user.clerkId) : handleUnfollow(clerkId, recommended_user.clerkId)}
                        >
                          {followStatuses[recommended_user.clerkId] === "follow" ? <UserPlus /> : <UserMinus />}
                        </Button>
                        <div>
                          {!Cookies.get(`feedback_${clerkId}_${recommended_user.clerkId}`) && (
                            <Popover>
                              <PopoverTrigger>
                                <div className="flex gap-2 border border-slate-800 px-2 py-[6px] rounded-md hover:bg-white hover:text-black">
                                  <Heart className="text-red-800" /> <HeartCrack className="text-slate-800" />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="bg-black text-white border border-slate-800">
                                <Label className="text-white">What do you think about <span className="text-slate-400">{recommended_user.username}</span>?</Label>
                                <Textarea className="bg-black text-white border border-slate-800" value={feedback} onChange={e => setFeedback(e.target.value)} />
                                <Button onClick={() => send_feedback(clerkId, recommended_user.clerkId, feedback)} className="ml-[200px] mt-[6px] bg-black text-white hover:text-black hover:bg-white"><SendHorizontal /></Button>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })
          ) : (
            Array.from({ length: Math.random() * 10 }, (_, index) => (
              <div key={index} className="flex justify-center items-center w-72 h-64 bg-black rounded-lg relative mb-6 mr-6">
                <Skeleton className="w-full h-full rounded-lg bg-gray-800 bg-opacity-45" />
              </div>
            ))
          )}
        </div>
      )}
      <style jsx>{`
  @keyframes pulsate {
    0% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.02);
    }
    20% {
      transform: scale(1.04);
    }
    30% {
      transform: scale(1.06);
    }
    40% {
      transform: scale(1.08);
    }
    50% {
      transform: scale(1.1);
    }
    60% {
      transform: scale(1.08);
    }
    70% {
      transform: scale(1.06);
    }
    80% {
      transform: scale(1.04);
    }
    90% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  .pulsating-dot {
    animation: pulsate 0.6s infinite;
  }
`}</style>
    </div>
  );
}
