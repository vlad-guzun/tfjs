// CheckDetails.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CheckDetails = ({
  onSubmit,
  onPrev,
  interests,
  location,
  reasonForJoining,
  onClose
}: {
  onSubmit: () => void;
  onPrev: () => void;
  interests: string;
  location: string;
  reasonForJoining: string;
  onClose: () => void;
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Check Details</h2>
      <p className="text-white mb-4">Interests: {interests}</p>
      <p className="text-white mb-4">Location: {location}</p>
      <p className="text-white mb-4">Reason for Joining: {reasonForJoining}</p>
      <div className="flex justify-between">
        <Button className="mt-8 mr-4 bg-black text-white" variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft />
        </Button>
        <Button className="mt-8 px-8 bg-black border border-white hover:bg-white hover:text-black" size="icon" onClick={() => { onSubmit(); onClose(); }}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default CheckDetails;
