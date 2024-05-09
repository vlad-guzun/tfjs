// Location.tsx
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Label } from "./ui/label";
import Hover from "./Hover";

const Location = ({ onNext, onPrev, onSave }: { onNext: () => void; onPrev: () => void; onSave: (data: string) => void }) => {
  const [location, setLocation] = useState("");

  const handleSave = () => {
    onSave(location);
  };

  return (
    <div>
      <div className="flex gap-2 items-center"><Label className="text-3xl text-yellow-700 mb-2"><Hover optionContent={`Enter your city, town or region`} completeOption="Location" textColor="text-yellow-800"/></Label><FaMapMarkedAlt className="text-yellow-800" size={30}/></div>
      <Textarea
        rows={8}
        className="bg-black text-white font-extrabold border-slate-700"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
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

export default Location;
