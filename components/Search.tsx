"use client";
import { useState, useEffect } from 'react';
import { SearchPopover } from './SearchPopover';

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User_with_interests_location_reason[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const res = await fetch(`/api/search?username=${query}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data.searchResult) ? data.searchResult : []);
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [query]);

  return (
    <SearchPopover 
      query={query} 
      setQuery={setQuery} 
      searchResults={searchResults} 
    />
  );
};

export default Search;
