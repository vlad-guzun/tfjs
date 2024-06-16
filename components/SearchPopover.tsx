import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchScroll } from "./SearchScroll";
import { Search } from "lucide-react";

export function SearchPopover({
  query,
  setQuery,
  searchResults
}: {
  query: string;
  setQuery: (query: string) => void;
  searchResults: User_with_interests_location_reason[];
}) {
  return (
    <div className="h-[600px]">
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-start w-24 mt-2"><Search size={20}/><span className="text-lg ml-1">search</span></Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px]  p-4 mt-3 h-full bg-black border-none">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="mb-4 h-4 bg-black text-white border shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
        />
        <SearchScroll searchResults={searchResults} />
      </PopoverContent>
    </Popover>
    </div>
  );
}
