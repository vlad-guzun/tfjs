import { useEffect } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();

  useEffect(() => {
    // Subscribe to the presence channel
    const channel: Channel = pusherClient.subscribe("presence-messanger");

    const handleSubscriptionSucceeded = (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    };

    const handleMemberAdded = (member: Record<string, any>) => {
      add(member.id);
    };

    const handleMemberRemoved = (member: Record<string, any>) => {
      remove(member.id);
    };

    // Bind event handlers
    channel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
    channel.bind("pusher:member_added", handleMemberAdded);
    channel.bind("pusher:member_removed", handleMemberRemoved);

    // Cleanup function to unbind events and unsubscribe from the channel
    return () => {
      channel.unbind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
      channel.unbind("pusher:member_added", handleMemberAdded);
      channel.unbind("pusher:member_removed", handleMemberRemoved);
      pusherClient.unsubscribe("presence-messanger");
    };
  }, [set, add, remove]);

  return null;
};

export default useActiveChannel;
