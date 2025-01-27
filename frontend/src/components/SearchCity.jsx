/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const SearchCity = ({ selectedCity, setSelectedCity, onSearch }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/venues/cities`
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }

    fetchCities();
  }, []);

  // useEffect(() => {
  //   async function fetchCities() {
  //     try {

  //       const response = await axios.get(process.env.REACT_APP_API_URL + '/venues/cities');

  //       setCities(response.data);
  //     } catch (error) {
  //       console.error("Error fetching cities:", error);
  //     }
  //   }

  //   fetchCities();
  // }, []);

  const handleSearch = () => {
    onSearch(selectedCity);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="p-1 lg:p-2 w-[300px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
      >
        <option value="All Cities" className="text-gray-500">
          All Cities
        </option>
        {cities.map((city, index) => (
          <option key={index} value={city} className="text-red-500">
            {city}
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

export default SearchCity;
