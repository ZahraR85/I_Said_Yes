/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const SearchCapacity = ({
  selectedCapacity,
  setSelectedCapacity,
  onSearch,
}) => {
  const [capacityRanges, setCapacityRanges] = useState([
    { label: "All Capacities", value: "All Capacities" },
    { label: "0 - 100", value: "0-100" },
    { label: "101 - 200", value: "101-200" },
    { label: "201 - 300", value: "201-300" },
    { label: "301 - 400", value: "301-400" },
    { label: "401 - 500", value: "401 - 500" },
    { label: "501+", value: "501+" },
  ]);

  const handleSearch = () => {
    onSearch(selectedCapacity);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <select
        value={selectedCapacity}
        onChange={(e) => setSelectedCapacity(e.target.value)}
        className="p-1 lg:p-2 w-[300px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
      >
        {capacityRanges.map((range, index) => (
          <option key={index} value={range.value} className="text-red-500">
            {range.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="bg-BgPinkMiddle text-BgFont text-m font-semibold px-4 py-2 rounded-md flex items-center hover:bg-BgPinkDark transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchCapacity;
