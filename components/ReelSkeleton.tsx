import React from 'react';

export function ReelSkeleton() {
  return (
    <div className="h-full w-full  animate-pulse pb-7">
      <div className="h-[700px] w-full bg-gray-800 rounded-lg bg-opacity-30"></div>
    </div>
  );
}
