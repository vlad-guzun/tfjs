import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const scrollAreaStyles: React.CSSProperties = {
  maxHeight: '18rem',
  width: '100%',
  borderRadius: '0.375rem',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.6)',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'white black',
};

const scrollAreaWebkitStyles = `
  .scroll-area::-webkit-scrollbar {
    width: 8px;
  }
  .scroll-area::-webkit-scrollbar-track {
    background: black;
  }
  .scroll-area::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 10px;
    border: 2px solid black;
  }
  .scroll-area::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
  }
`;

export function SearchScroll({ searchResults }: { searchResults: User_with_interests_location_reason[] }) {
  return (
    <div className="scroll-area" style={scrollAreaStyles}>
      <style>{scrollAreaWebkitStyles}</style>
      <div className="p-1">
        {searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'white' }}>No results</div>
        ) : (
          searchResults.map((search) => (
            <div key={search.clerkId}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '0.5rem', marginTop: '1rem', color: 'white' }}>
                <Image className="rounded-full" src={search.photo} width={30} height={30} alt={search.clerkId} />
                <span>{search.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
