
import React from 'react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = React.memo(({ label, options, value, onChange }) => {
  return (
    <div className="flex-shrink-0">
      <select
        value={value}
        onChange={onChange}
        aria-label={`Filter by ${label}`}
        className="appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 pr-8 cursor-pointer"
      >
        <option value="all">All {label}s</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
});

FilterDropdown.displayName = 'FilterDropdown';

export default FilterDropdown;
