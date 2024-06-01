"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function ProgressReel({ value }: { value: number }) {
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return <Progress value={progress} className="w-[60%]" />;
}
