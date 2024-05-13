"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CheckCheck } from 'lucide-react';
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

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
      <div className="flex items-center gap-2"><h3 className="text-white text-3xl mb-2">Check Details</h3><CheckCheck color="white" /></div>
      <p className="text-white mb-4"> <Label className="text-2xl"><span className="text-gray-500">Interests:</span> {interests}</Label></p>
      <p className="text-white mb-4"> <Label className="text-2xl"><span className="text-gray-500">Location:</span> {location}</Label></p>
      <p className="text-white mb-4"> <Label className="text-2xl"><span className="text-gray-500">Bcz: </span>{reasonForJoining}</Label></p>
      <div className="flex justify-between">
        <Button className="mt-8 mr-4 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft />
        </Button>
        <Button className="mt-8 px-8 bg-black border border-slate-700 hover:bg-white hover:text-black " size="icon" onClick={() => { onSubmit(); onClose(); toast({
        description: `Please refresh the page if you don't see any results`,
        style: {
          backgroundColor: "black",
          color: "white",
          border: "1px slate-800 solid",
          fill: "white",
        
        }
      }); }}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default CheckDetails;
