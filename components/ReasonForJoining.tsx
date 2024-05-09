// ReasonForJoining.tsx
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "./ui/label";
import { TbHeartQuestion } from "react-icons/tb";
import Hover from "./Hover";

const ReasonForJoining = ({
  onNext,
  onPrev,
  onSave
}: {
  onNext: () => void;
  onPrev: () => void;
  onSave: (data: string) => void;
}) => {
  const [reasonForJoining, setReasonForJoining] = useState("");

  const handleSave = () => {
    onSave(reasonForJoining);
  };

  return (
    <div>
      <div className="flex items-center mb-2"><Hover optionContent="Be descriptive! ex: I'm here to create a team and discover hidden gems in the city." completeOption="Why decided joining" textColor="text-slate-400"></Hover> <TbHeartQuestion className="text-slate-400" size={30} /></div>
      <Textarea
        rows={8}
        className="bg-black text-white font-extrabold border-slate-700"
        value={reasonForJoining}
        onChange={(e) => setReasonForJoining(e.target.value)}
      />
      <div className="flex justify-center">
        <Button className="mt-8 mr-4 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={handleSave}>
          Save
        </Button>
        <Button className="mt-8 mr-4 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button className="mt-8 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReasonForJoining;
