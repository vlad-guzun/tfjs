import React from "react";
import { Copy } from "lucide-react";
import { toast } from "./ui/use-toast";

interface CopyProfileLinkProps {
  username: string;
}

const CopyProfileLink: React.FC<CopyProfileLinkProps> = ({ username }) => {
  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/myprofile/${username}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
        toast({
            description: `Profile copied to clipboard!`,
            style: {
              backgroundColor: "black",
              color: "white",
              border: "1px slate-800 solid",
              fill: "white",
              width: "60%",
              borderColor: "slate-800",
            }
          })
    });
  };

  return (
    <div className="flex items-center ">
      <Copy onClick={copyProfileLink} className="cursor-pointer " color="white" size={18} />
    </div>
  );
};

export default CopyProfileLink;
