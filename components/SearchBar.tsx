
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <i className="fas fa-search text-gray-400"></i>
      </span>
      <input
        type="text"
        placeholder="Search for beats or producers..."
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      />
    </div>
  );
};

export default SearchBar;
