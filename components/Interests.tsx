// Interests.tsx
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { MdOutlineInterests } from "react-icons/md";
import { Label } from "./ui/label";
import Hover from "./Hover";

const Interests = ({ onNext, onSave }: { onNext: () => void; onSave: (data: string) => void }) => {
  const [interests, setInterests] = useState("");

  const handleSave = () => {
    onSave(interests);
  };

  return (
    <div>
      <div className="flex items-center mb-2 "><Label className="text-3xl text-red-800"><Hover  completeOption={`interests`} optionContent="Need ideas? How about sharing your favorite movies, TV shows, or hobbies? Let's help you find someone with similar interests!" textColor="text-red-800" /></Label> <MdOutlineInterests className="text-red-800" size={30} /></div>
      <Textarea
        rows={8}
        className="bg-black text-white font-extrabold border-slate-700"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />
      <div className="flex justify-center">
        <Button className="mt-8 mr-4 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={handleSave}>
          Save
        </Button>
        <Button className="mt-8 bg-black text-white border-slate-700" variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Interests;
