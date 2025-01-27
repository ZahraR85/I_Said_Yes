import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchCity from "../components/SearchCity";
import SearchCapacity from "../components/SearchCapacity";
import SearchPrice from "../components/SearchPrice"; // Import SearchPrice

const VenueSelectionPage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userId, isAuthenticated, selectedCity, setSelectedCity } =
    useAppContext();
  const [selectedCapacity, setSelectedCapacity] = useState("All Capacities");
  const [selectedPrice, setSelectedPrice] = useState("All Price");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const venueResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/venues`
        );
        setVenues(venueResponse.data);
        setFilteredVenues(venueResponse.data); // Initialize filteredVenues
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch venue data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && isAuthenticated) {
      fetchData();
    }
  }, [userId, isAuthenticated]);

  const handleVenueClick = (venueId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a venue.");
      navigate("/login");
      return;
    }
    navigate(`/venueBooking/${venueId}`);
  };

  // Filter venues based on the selected city, capacity, and price
  const handleCitySearch = (city) => {
    let filtered = venues;
    if (city !== "All Cities") {
      filtered = filtered.filter((venue) => venue.city === city);
    }
    if (selectedCapacity !== "All Capacities") {
      const capacityRange = selectedCapacity.split("-");
      if (capacityRange.length === 2) {
        const [min, max] = capacityRange.map(Number);
        filtered = filtered.filter(
          (venue) => venue.capacity >= min && venue.capacity <= max
        );
      } else {
        const min = Number(capacityRange[0].replace("+", ""));
        filtered = filtered.filter((venue) => venue.capacity >= min);
      }
    }
    if (selectedPrice !== "All Price") {
      const priceRange = selectedPrice.split("-");
      if (priceRange.length === 2) {
        const [min, max] = priceRange.map(Number);
        filtered = filtered.filter(
          (venue) => venue.price >= min && venue.price <= max
        );
      } else {
        const min = Number(priceRange[0].replace("+", ""));
        filtered = filtered.filter((venue) => venue.price >= min);
      }
    }
    setFilteredVenues(filtered);
  };

  // Handle capacity and price search
  const handleCapacitySearch = (capacity) => {
    setSelectedCapacity(capacity);
    handleCitySearch(selectedCity);
  };

  const handlePriceSearch = (price) => {
    setSelectedPrice(price);
    handleCitySearch(selectedCity); // Reapply city filter after price update
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center p-2 lg:p-6 bg-BgPink">
      <ToastContainer />
      <div className="absolute inset-0 bg-white/40"></div>
      <div className="relative mx-auto w-full max-w-[calc(100%-10px)] bg-white shadow-md rounded-lg p-2 lg:p-5 space-y-4">
        {loading && <p>Loading venues...</p>}
        {error && <p>{error}</p>}
        <h2 className="text-sm lg:text-xl font-bold text-center text-BgFont mb-5">
          You can Search your desired Venue by City, Price and capacity that you
          need here and then select one Card to book.
        </h2>
        {/* SearchCity Component */}
        <div className="mb-4">
          <SearchCity
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onSearch={handleCitySearch}
          />
        </div>

        {/* SearchCapacity Component */}
        <div className="mb-4">
          <SearchCapacity
            selectedCapacity={selectedCapacity}
            setSelectedCapacity={setSelectedCapacity}
            onSearch={handleCapacitySearch}
          />
        </div>

        {/* SearchPrice Component */}
        <div className="mb-4">
          <SearchPrice
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onSearch={handlePriceSearch} // Pass handlePriceSearch
          />
        </div>

        {/* Venue Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue._id}
              className="border-4 border-BgPinkDark rounded-lg cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
              onClick={() => handleVenueClick(venue._id)}
            >
              <img
                src={`${venue.images?.[0]}`}
                alt={venue.name}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                } // Fallback for missing images
              />
              <h3 className="text-m lg:text-xl text-BgFont font-bold mt-2 px-4">
                {venue.name}
              </h3>
              <p className="text-sm text-BgFont lg:text-m font-semibold mt-2 px-4">
                Capacity: {venue.capacity}
              </p>
              <p className="text-sm text-BgFont lg:text-m font-semibold mt-2 px-4">
                Price: ${venue.price}
              </p>
              <p className="text-sm text-BgFont lg:text-m font-semibold my-2 px-4">
                City: {venue.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueSelectionPage;
