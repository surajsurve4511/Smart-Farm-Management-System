
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        disabled={disabled}
        className="w-full px-4 py-2 text-neutral-800 bg-white border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
        aria-label="Search for a city's weather"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 text-white bg-brand-blue rounded-r-md hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-neutral-400"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
