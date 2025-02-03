import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const features = [
  {
    id: "photography",
    label: "Photography 150€",
    price: 150,
    description:
      "This Price is per each one hours. Capturing memorable moments with precision and creativity.",
  },
  {
    id: "videography",
    label: "Videography 100€",
    price: 100,
    description:
      "This Price is per each one hours. creating cinematic wedding videos to cherish forever.",
  },
  {
    id: "clipConstruction",
    label: "Clip Construction 100€",
    price: 100,
    description:
      "This Price is per each one Minutes. Custom video clips tailored to your preferences.",
  },
  {
    id: "physicalAlbum",
    label: "Physical Album 500€",
    price: 500,
    description:
      " Beautifully crafted physical albums featuring 20 premium-quality photographs.",
  },
  {
    id: "giftImageSize",
    label: "Gift Image for guests 10€",
    price: 10,
    description:
      "Personalized gift-sized ( 10 x 15) images for guests on Wood.",
  },
];

const Photography = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photography: { number: 0, price: 150 },
    videography: { number: 0, price: 100 },
    clipConstruction: { number: 0, price: 100 },
    physicalAlbum: { selected: false, price: 500 },
    giftImageSize: { number: 0, price: 10 },
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  // Redirect unauthenticated users to SignIn
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  // Fetch data if the userId is available
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          //const response = await axios.get(`http://localhost:3001/photographies?userID=${userId}`);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/photographies?userID=${userId}`
          );
          if (response.data) {
            // Update to work with either array or object
            const existingData = Array.isArray(response.data)
              ? response.data[0]
              : response.data;
            const updatedFormData = {
              photography: existingData.photography || {
                number: 0,
                price: 150,
              },
              videography: existingData.videography || {
                number: 0,
                price: 100,
              },
              clipConstruction: existingData.clipConstruction || {
                number: 0,
                price: 100,
              },
              physicalAlbum: existingData.physicalAlbum || {
                selected: false,
                price: 500,
              },
              giftImageSize: existingData.giftImageSize || {
                number: 0,
                price: 10,
              },
            };
            setFormData(updatedFormData);
            setIsEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching photography data:", error);
          //toast.error("Failed to fetch photography data!");
        }
      };
      fetchData();
    }
  }, [userId]);

  // Calculate total price dynamically based on the form data
  useEffect(() => {
    const calculatedTotal = Object.keys(formData).reduce((sum, key) => {
      const feature = formData[key];
      if (feature.number && feature.price) {
        return sum + feature.number * feature.price;
      } else if (feature.selected && feature.price) {
        return sum + feature.price;
      }
      return sum;
    }, 0);
    setTotal(calculatedTotal);
  }, [formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const category = dataset.category;

    setFormData((prevData) => {
      const updatedData = { ...prevData };
      if (type === "checkbox") {
        updatedData[category][name] = checked;
      } else {
        updatedData[category][name] = parseInt(value, 10);
      }
      return updatedData;
    });
  };

  // Submit form data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`http://localhost:3001/photographies?userID=${userId}`);
      const url = `${import.meta.env.VITE_API_URL}/photographies`;
      const requestData = {
        userID: userId,
        photography: formData.photography,
        videography: formData.videography,
        clipConstruction: formData.clipConstruction,
        physicalAlbum: formData.physicalAlbum,
        giftImageSize: formData.giftImageSize,
      };

      console.log("Sending data:", requestData);
      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `entertain ${isEditMode ? "updated" : "created"} successfully!`
        );
        if (!isEditMode) {
          setIsEditMode(true); // Switch to edit mode after creating
        }
        const shoppingCartUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
        // Save shopping cart data
        const shoppingCartData = {
          userID: userId,
          serviceName: "Photography",
          price: total,
        };

        await axios.post(shoppingCartUrl, shoppingCartData, {
          headers: { "Content-Type": "application/json" },
        });

        // Frontend-only addition (optional if the backend handles the cart data)
        addToShoppingCard(shoppingCartData);

        toast.success(
          "Catering data and total price added to shopping cart successfully!"
        );
        setTimeout(() => {
          // navigate("/shoppingCard");
        }, 3000);
      } else {
        toast.error("Failed to save data!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data!");
    } finally {
      setLoading(false);
    }
  };
  const handleMouseEnter = (description) => {
    setCurrentDescription(description);
  };

  const handleMouseLeave = () => {
    setCurrentDescription("");
  };
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('https://i.postimg.cc/Kv1WnL9Q/photography.png')]">
      <div className="absolute inset-0 bg-white/60"></div>
      <ToastContainer />
      <div className="relative mx-auto w-full max-w-[calc(80%-200px)] lg:max-w-[calc(60%-180px)] bg-opacity-80 shadow-md rounded-lg p-4 sm:p-8 space-y-5">
        <h2 className="text-lg lg:text-2xl font-bold text-center text-BgFont mt-2 lg:mt-14">
          Select your Photography Services here!
        </h2>
        {/* Hover Description */}
        <div className="mt-2 bg-BgPink p-2 lg:p-4 text-BgFont rounded min-h-[80px] lg:min-h-[120px] overflow-y-auto">
          <h2 className="text-sm lg:text-lg font-bold">Description:</h2>
          <p className="text-xs lg:text-sm">
            {currentDescription || "Hover over an option to see details."}
          </p>
        </div>
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center justify-between"
            onMouseEnter={() => handleMouseEnter(feature.description)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont w-1/2 ">
              {feature.label}:
            </span>
            {feature.id === "physicalAlbum" ? (
              <input
                type="checkbox"
                name="selected"
                data-category={feature.id}
                checked={formData[feature.id]?.selected || false}
                onChange={handleChange}
                className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
              />
            ) : (
              <input
                type="number"
                name="number"
                data-category={feature.id}
                value={formData[feature.id]?.number || 0}
                onChange={handleChange}
                className="border px-2 lg:p-2 rounded w-1/3 border-BgPinkDark hover:border-BgPinkDark hover:border-2 focus:outline-none focus:border-BgPinkDark"
              />
            )}
          </div>
        ))}
        <h2 className="text-m lg:text-xl font-bold text-BgFont text-center lg:py-4">
          Total Price: {total} €
        </h2>
        <button
          onClick={handleSubmit}
          className="bg-BgPinkMiddle text-BgFont text-lg font-bold hover:bg-BgPinkDark w-full px-2 lg:px-4 py-1 lg:py-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : isEditMode ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Photography;
