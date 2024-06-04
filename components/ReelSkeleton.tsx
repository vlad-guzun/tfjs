import React from 'react';

export function ReelSkeleton() {
  return (
    <div className="h-full w-full  animate-pulse bg-slate-950  rounded-md pb-7 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]" style={{ backgroundColor: '#000000' }}>
      <div className="h-[700px] w-[400px]  opacity-15 rounded-lg bg-opacity-30"></div>
    </div>
  );
}
