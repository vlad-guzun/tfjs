import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { pusherServer } from "@/lib/pusher";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  
    const {userId}  = getAuth(req);
  
      if (!userId) {
        return res.status(401);
      }

      const { channel_name, socket_id } = req.body;

      const presenceData = {user_id: userId};

      const authResponse = pusherServer.authorizeChannel(socket_id,channel_name,presenceData);
      console.log(authResponse);
      return res.send(authResponse);
};

