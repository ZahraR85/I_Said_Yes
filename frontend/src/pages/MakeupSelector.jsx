import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const features = [
  {
    id: "makeup",
    label: "Makeup",
    price: 300,
    description:
      "Professional makeup for the bride and groom, including high-definition airbrush techniques, contouring, and personalized palettes tailored to skin tone and style. Includes trials and touch-ups throughout the day.",
  },
  {
    id: "shoes",
    label: "Shoes",
    price: 100,
    description:
      "Elegant shoes for the perfect look, available in custom designs and a variety of styles including stilettos, flats, and classic formal shoes. Comfort and style ensured for all-day wear. Set by your dress and style!",
  },
  {
    id: "dress",
    label: "Dress Rental ",
    price: 500,
    description:
      "Designer dress for the big day for 24 hours with options for traditional gowns, modern silhouettes, and custom-made designs. Includes fitting sessions and fabric customization for a flawless fit.",
  },
  {
    id: "nail",
    label: "Nail",
    price: 70,
    description:
      "Beautiful nail art for the bride, offering services like gel extensions, intricate designs, and a wide range of colors to complement the wedding theme. Includes a consultation for unique styling.",
  },
  {
    id: "hairstyle",
    label: "Hairstyle",
    price: 200,
    description:
      "Stunning hairstyles for the bride and groom, including updos, curls, and sleek styles. Each style is customized based on face shape, outfit, and personal preference. Includes pre-event trials.",
  },
  {
    id: "special",
    label: "Special",
    price: 300,
    description:
      "Special package with unique add-ons like skincare treatments, personalized gift boxes, or additional beauty services for family members. Perfect for an all-inclusive wedding experience.",
  },
];

const MakeupSelector = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState({
    makeup: { selected: false, price: 300 },
    dress: { selected: false, price: 500 },
    nail: { selected: false, price: 70 },
    hairstyle: { selected: false, price: 200 },
    shoes: { selected: false, price: 100 },
    special: { selected: false, price: 300 },
  });
  const [total, setTotal] = useState(0); // Total for UI display
  const [currentDescription, setCurrentDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/makeups?userID=${userId}`
        );
        if (response.data) {
          const existingData = response.data;
          setSelectedFeatures({
            makeup: existingData.makeup || { selected: false, price: 300 },
            dress: existingData.dress || { selected: false, price: 500 },
            nail: existingData.nail || { selected: false, price: 70 },
            hairstyle: existingData.hairstyle || {
              selected: false,
              price: 200,
            },
            shoes: existingData.shoes || { selected: false, price: 100 },
            special: existingData.special || { selected: false, price: 300 },
          });
          setIsEditMode(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Calculate the total dynamically
  useEffect(() => {
    const calculatedTotal = Object.keys(selectedFeatures).reduce((sum, key) => {
      const feature = selectedFeatures[key];
      return feature?.selected ? sum + feature.price : sum;
    }, 0);
    setTotal(calculatedTotal);
  }, [selectedFeatures]);

  const handleCheckboxChange = (id) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id]?.selected },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const makeupUrl = `${import.meta.env.VITE_API_URL}/makeups`;
      const shoppingCartUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
      const requestData = {
        userID: userId,
        makeup: selectedFeatures.makeup?.selected || false,
        dress: selectedFeatures.dress?.selected || false,
        nail: selectedFeatures.nail?.selected || false,
        hairstyle: selectedFeatures.hairstyle?.selected || false,
        shoes: selectedFeatures.shoes?.selected || false,
        special: selectedFeatures.special?.selected || false,
      };

      await axios.post(makeupUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      // Save shopping cart data
      const shoppingCartData = {
        userID: userId,
        serviceName: "Makeup",
        price: total,
      };
      console.log(shoppingCartData);
      await axios.post(shoppingCartUrl, shoppingCartData, {
        headers: { "Content-Type": "application/json" },
      });

      // Frontend-only addition (optional if the backend handles the cart data)
      addToShoppingCard(shoppingCartData);

      toast.success(
        "Makeup data and total price added to shopping cart successfully!"
      );
      setTimeout(() => {
        navigate("/shoppingCard");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save makeup data or add to shopping cart.",
        error
      );
      toast.error("Error saving data or adding to shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative min-h-screen bg-cover bg-center lg:pt-20 sm:p-6 bg-pink-100 lg:bg-[url('https://i.postimg.cc/TwNqd9Bm/makeup2.jpg')]">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative mx-auto w-full lg:max-w-[calc(60%-250px)] sm:max-w-[calc(100%-40px)] bg-opacity-80 shadow-md rounded-lg p-4 sm:p-6 space-y-3">
          <h1 className="text-lg lg:text-2xl font-bold text-BgFont m-10 text-center">
            Select your Makeup services that you need:
          </h1>

          {/* Feature Selection */}
          <form className="space-y-3 font-bold">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between text-BgFont"
              >
                <div
                  onMouseEnter={() =>
                    setCurrentDescription(feature.description)
                  }
                  onMouseLeave={() => setCurrentDescription("")}
                  className="cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={feature.id}
                    checked={selectedFeatures[feature.id]?.selected || false}
                    onChange={() => handleCheckboxChange(feature.id)}
                    className="mr-2 w-5 h-5"
                  />
                  <label
                    htmlFor={feature.id}
                    className="text-sm lg:text-lg font-semibold lg:font-bold"
                  >
                    {feature.label} ({feature.price} €)
                  </label>
                </div>
              </div>
            ))}
          </form>

          {/* Total Price */}
          <div className="text-center text-lg lg:text-xl text-BgFont mt-4 font-bold">
            Total: {total} €
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-BgPinkMiddle text-m lg:text-lg text-BgFont font-bold py-2 px-4 rounded hover:bg-BgPinkDark"
            disabled={loading}
          >
            {loading ? "Processing..." : isEditMode ? "Update" : "Submit"}
          </button>
        </div>

        {/* Fixed Description Box */}
        <div className="absolute top-20 right-2 lg:right-20 bg-white shadow-lg p-3 lg:p-5 w-80 lg:w-96 rounded-lg">
          <h3 className="text-m lg:text-lg font-bold text-BgFont mb-2">
            Feature Description:
          </h3>
          <p className="text-BgFont text-sm sm:text-base">
            {currentDescription || "Hover over a feature to see its details!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakeupSelector;
