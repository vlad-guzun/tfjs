// Location.tsx
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Location = ({ onNext, onPrev, onSave }: { onNext: () => void; onPrev: () => void; onSave: (data: string) => void }) => {
  const [location, setLocation] = useState("");

  const handleSave = () => {
    onSave(location);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Location</h2>
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
