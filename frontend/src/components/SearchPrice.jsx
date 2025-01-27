/* eslint-disable react/prop-types */
import { useState } from "react";

const SearchPrice = ({ selectedPrice, setSelectedPrice, onSearch }) => {
  const [priceRanges, setPriceRanges] = useState([
    { label: "All Price", value: "All Price" },
    { label: "0 - 1000", value: "0-1000" },
    { label: "1001 - 2000", value: "1001-2000" },
    { label: "2001 - 3000", value: "2001-3000" },
    { label: "3001 - 4000", value: "3001-4000" },
    { label: "4001 - 5000", value: "4001-5000" },
    { label: "5001 - 6000", value: "5001-6000" },
    { label: "6001 - 7000", value: "6001-7000" },
    { label: "7001 - 8000", value: "7001-8000" },
    { label: "8001+", value: "8001+" },
  ]);

  const handleSearchPrice = () => {
    onSearch(selectedPrice); // Trigger the search with the selected price range
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <select
        value={selectedPrice}
        onChange={(e) => setSelectedPrice(e.target.value)} // Correctly update state
        className="p-1 lg:p-2 w-[300px]  border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
      >
        {priceRanges.map((range, index) => (
          <option key={index} value={range.value} className="text-red-500">
            {range.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearchPrice}
        className="bg-BgPinkMiddle text-BgFont text-m font-semibold px-4 py-2 rounded-md flex items-center hover:bg-BgPinkDark transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchPrice;
