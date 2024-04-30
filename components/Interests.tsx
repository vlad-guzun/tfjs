// Interests.tsx
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Interests = ({ onNext, onSave }: { onNext: () => void; onSave: (data: string) => void }) => {
  const [interests, setInterests] = useState("");

  const handleSave = () => {
    onSave(interests);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Interests</h2>
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
