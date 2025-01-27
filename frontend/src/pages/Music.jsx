import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const MusicSelectionForm = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate(); // Navigation hook

  const [musicOptions, setMusicOptions] = useState([]);
  const [userSelection, setUserSelection] = useState(null); // Store user data from the database
  const [hours, setHours] = useState({}); // Track hours for each music option
  const [customRequest, setCustomRequest] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  // Fetch music options and user data on load
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Fetch music options

        const optionsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/musicoptions`
        );
        console.log("Fetched Music Options:", optionsResponse.data);
        setMusicOptions(optionsResponse.data);
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/musics?userID=${userId}`
        );
        console.log("Fetched User Data:", userResponse.data); // Debugging
        if (userResponse.data) {
          // Map fetched selections to hours for pre-filling
          const mappedHours = userResponse.data.selections.reduce(
            (acc, selection) => {
              acc[selection.optionID._id] = selection.hours; // Use optionID._id as the key
              return acc;
            },
            {}
          );
          // Map selections to hours state
          setHours(mappedHours); // Pre-fill hours
          setUserSelection(userResponse.data); // Store user data

          setIsEditMode(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Calculate total cost dynamically
  useEffect(() => {
    if (musicOptions.length > 0) {
      const totalCost = musicOptions.reduce((total, option) => {
        const selectedHours = parseInt(hours[option._id] || 0, 10);
        return total + selectedHours * option.pricePerHour;
      }, 0);

      setUserSelection((prev) => ({
        ...prev,
        totalCost,
      }));
    }
  }, [hours, musicOptions]);

  const handleHoursChange = (optionID, value) => {
    setHours((prev) => ({
      ...prev,
      [optionID]: value,
    }));
  };

  const addCustomRequest = () => {
    if (customRequest.trim()) {
      setUserSelection((prev) => ({
        ...prev,
        customRequests: [
          ...(prev?.customRequests || []),
          { description: customRequest },
        ],
      }));
      setCustomRequest("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare selections based on user input
      const selections = musicOptions
        .filter((option) => hours[option._id] > 0)
        .map((option) => ({
          optionID: option._id,
          hours: parseInt(hours[option._id], 10),
          totalPrice: parseInt(hours[option._id], 10) * option.pricePerHour,
        }));
      // Calculate total cost
      const totalCost = selections.reduce(
        (total, selection) => total + selection.totalPrice,
        0
      );
      // Prepare data for music selection
      const musicSelectionData = {
        userID: userId,
        selections,
        customRequests: userSelection?.customRequests || [],
        totalCost,
      };

      // Add or update music selection
      const musicUrl = `${import.meta.env.VITE_API_URL}/musics${
        isEditMode ? `/${userSelection._id}` : ""
      }`;
      const musicMethod = isEditMode ? "PUT" : "POST";
      await axios({
        method: musicMethod,
        url: musicUrl,
        data: musicSelectionData,
        headers: { "Content-Type": "application/json" },
      });

      // Add or update shopping card entry
      const shoppingCardUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
      const shoppingCardData = {
        userID: userId,
        serviceName: "Music",
        price: totalCost,
      };
      await axios.post(shoppingCardUrl, shoppingCardData, {
        headers: { "Content-Type": "application/json" },
      });

      // Optionally update frontend context
      addToShoppingCard(shoppingCardData);

      toast.success(
        `Music selection ${isEditMode ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      console.error("Error saving music selection:", error);
      toast.error("Failed to save music selection!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center px-4 lg:px-20 py-6 lg:py-10 bg-[url('https://i.postimg.cc/mgjJ2Qjw/music1.png')]">
      <ToastContainer />
      {/* Overlay for controlling opacity */}
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="relative mx-auto w-full max-w-full lg:max-w-[calc(80%-100px)] bg-opacity-80 shadow-md rounded-lg p-4 space-y-6">
        <h2 className="text-xl lg:text-2xl font-bold text-center text-BgFont mb-4">
          Select your Music bands
        </h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-sm lg:text-lg font-semibold text-BgFont border-b pb-2 mb-4">
            You can choose several Music instrument, bands, DJ and etc. Price is
            counted per hour!
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {musicOptions.map((option) => (
              <div
                key={option._id}
                onMouseEnter={() => setHoveredOption(option._id)}
                onMouseLeave={() => setHoveredOption(null)}
                className="relative border p-4 rounded-lg bg-gray-50"
              >
                <p className="text-sm lg:text-lg font-bold text-BgFont mb-2">
                  {option.name}
                </p>
                <p className="text-sm lg:text-lg text-BgFont font-semibold mb-2">
                  Price: {option.pricePerHour} €/hour
                </p>
                <label className="block">
                  <input
                    type="number"
                    min="0"
                    placeholder="Hours"
                    value={hours[option._id] || ""}
                    onChange={(e) =>
                      handleHoursChange(option._id, e.target.value)
                    }
                    className="w-full p-2 text-sm lg:text-lg border border-BgPinkDark rounded hover:border-BgPinkDark hover:border-2 focus:outline-none focus:border-BgPinkDark"
                  />
                </label>
                {hoveredOption === option._id && (
                  <div className="absolute top-2 left-full ml-4 p-8 bg-customBg1 border rounded shadow-lg w-96 z-10">
                    <p className="text-sm lg:text-lg text-BgFont font-semibold">
                      {option.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <h3 className="text-m lg:text-lg font-bold text-BgFont border-b pb-2 mt-6 mb-4">
            Add Custom Requests
          </h3>
          <div className="flex gap-2">
            <textarea
              type="text"
              placeholder="Enter a custom request"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              className="flex-1 p-2 border border-BgPinkDark rounded text-BgFont hover:border-BgPinkDark hover:border-2 focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <button
              type="button"
              onClick={addCustomRequest}
              className="p-2 bg-BgPinkMiddle text-BgFont font-semibold lg:font-bold rounded hover:bg-BgPinkDark"
            >
              Add Request
            </button>
          </div>
          <ul className="mt-4 list-disc pl-6 text-BgFont">
            {userSelection?.customRequests?.map((request, index) => (
              <li key={index}>{request.description}</li>
            ))}
          </ul>
          <h3 className="text-lg lg:text-2xl font-semibold lg:font-bold text-center text-BgFont mt-6">
            Total Cost:{" "}
            <span className="text-BgFont">
              {userSelection?.totalCost || 0} €
            </span>
          </h3>
          <button
            type="submit"
            className="block w-full mt-6 p-3 bg-BgPinkMiddle text-BgFont font-semibold lg:font-bold rounded-lg hover:bg-BgPinkDark"
            disabled={loading}
          >
            {loading ? "Processing..." : isEditMode ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MusicSelectionForm;
