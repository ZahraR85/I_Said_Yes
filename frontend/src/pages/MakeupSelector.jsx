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
    id: "eyelashExtensions",
    label: "eyelashExtensions",
    price: 100,
    description:
      "Elegant shoes for the perfect look, available in custom designs and a variety of styles including stilettos, flats, and classic formal shoes. Comfort and style ensured for all-day wear. Set by your dress and style!",
  },
  {
    id: "dyeHair",
    label: "dyeHair ",
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
const MakeupForm = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState({
    makeup: { selected: false, price: 300 },
    dyeHair: { selected: false, price: 500 },
    nail: { selected: false, price: 70 },
    hairstyle: { selected: false, price: 200 },
    eyelashExtensions: { selected: false, price: 100 },
    special: { selected: false, price: 300 },
  });
  const [makeup, setMakeup] = useState("Budget Makeup");
  const [hairstyle, setHairstyle] = useState("Simple Shenyun"); // Set to a valid string from options
  const [dyeHair, setDyeHair] = useState("Full Hair Color - Short Hair"); // Set to a valid string from options    const [nail, setNail] = useState(false);
  const [nail, setNail] = useState(false);
  const [eyelashExtensions, setEyelashExtensions] = useState(false);
  const [special, setSpecial] = useState(false);
  const [total, setTotal] = useState(0);
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
    const fetchMakeupData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/makeups?userID=${userId}`
        );
        const data = response.data;
        setMakeup(data.makeup);
        setHairstyle(data.hairstyle);
        setDyeHair(data.dyeHair);
        setNail(data.nail.selected);
        setEyelashExtensions(data.eyelashExtensions.selected);
        setSpecial(data.special.selected);
        setTotal(data.total); // Set the total price from the backend
      } catch (error) {
        console.error("Error fetching makeup data", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
    };

    if (userId) {
      fetchMakeupData();
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
    setSelectedFeatures((prev) => {
      const updated = { ...prev };
      updated[id].selected = !updated[id].selected;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validTotal = isNaN(total) ? 0 : total; // Validate total
    // Handle form submission (ensure these values are valid when posting to backend)
    const data = {
      userID: userId,
      makeup,
      hairstyle,
      dyeHair,
      nail,
      eyelashExtensions,
      special,
      total: validTotal,
    };

    try {
      const makeupUrl = `${import.meta.env.VITE_API_URL}/makeups`;
      await axios.post(makeupUrl, data, {
        headers: { "Content-Type": "application/json" },
      });

      // Save shopping cart data
      const shoppingCartUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
      const shoppingCartData = {
        userID: userId,
        serviceName: "Makeup",
        price: total,
      };
      await axios.post(shoppingCartUrl, shoppingCartData, {
        headers: { "Content-Type": "application/json" },
      });

      // Frontend-only addition (optional)
      addToShoppingCard(shoppingCartData);

      toast.success(
        "Makeup data and total price added to shopping cart successfully!"
      );
      setTimeout(() => {
        navigate("/shoppingCard");
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving makeup data or adding to shopping cart.",
        error
      );
      toast.error("Error saving data or adding to shopping cart.");
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('https://i.postimg.cc/TwNqd9Bm/makeup2.jpg')]">
      <div className="absolute inset-0 bg-white/60"></div>
      <ToastContainer />
      <div className="relative mx-auto w-full max-w-[calc(85%-170px)] lg:max-w-[calc(60%-200px)] bg-opacity-80 shadow-md rounded-lg p-4 sm:p-8 space-y-5">
        <h2 className="text-lg lg:text-2xl font-bold text-center text-BgFont my-1 lg:my-16">
          Select your Makeup services that you need:
        </h2>
        <div>
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Makeup Type:
          </label>
          <select
            value={makeup}
            onChange={(e) => setMakeup(e.target.value)}
            className="p-1 lg:p-2 w-[350px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
          >
            <option value="Budget Makeup">Budget Makeup 150 €</option>
            <option value="Luxury Makeup">Luxury Makeup 300 €</option>
            <option value="VIP Makeup">VIP Makeup 500 €</option>
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Hairstyle:
          </label>
          <select
            value={hairstyle}
            onChange={(e) => setHairstyle(e.target.value)}
            className="p-1 lg:p-2 w-[350px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
          >
            <option value="Simple Shenyun">Simple Shenyun 100 €</option>
            <option value="Complex Shenyun">Complex Shenyun 150 €</option>
            <option value="Babylis">Babylis 100 €</option>
            <option value="Extra Hair Extension">
              Extra Hair Extension 150 €
            </option>
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Dye Hair:
          </label>
          <select
            value={dyeHair}
            onChange={(e) => setDyeHair(e.target.value)}
            className="p-1 lg:p-2 w-[350px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
          >
            {/* List of hair colors */}
            <option value="Full Hair Color - Short Hair">
              Full Hair Color (Short Hair) 50 €
            </option>
            <option value="Full Hair Color - Medium Hair">
              Full Hair Color (Medium Hair) 80 €
            </option>
            <option value="Full Hair Color - Long Hair">
              Full Hair Color (Long Hair) 120 €
            </option>
            <option value="Full Hair Color - Very Long Hair">
              Full Hair Color (Very Long Hair) 150 €
            </option>
            <option value="Highlights - Short Hair">
              Highlights (Short Hair) 80 €
            </option>
            <option value="Highlights - Medium Hair">
              Highlights (Medium Hair) 120 €
            </option>
            <option value="Highlights - Long Hair">
              Highlights (Long Hair) 160 €
            </option>
            <option value="Highlights - Very Long Hair">
              Highlights (Very Long Hair) 200 €
            </option>
            <option value="Balayage - Short Hair">
              Balayage (Short Hair) 100 €
            </option>
            <option value="Balayage - Medium Hair">
              Balayage (Medium Hair) 200 €
            </option>
            <option value="Balayage - Long Hair">
              Balayage (Long Hair) 300 €
            </option>
            <option value="Balayage - Very Long Hair">
              Balayage (Very Long Hair) 400 €
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={nail}
              onChange={(e) => setNail(e.target.checked)}
              className="mr-2  text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Nail 70 €
          </label>
        </div>

        <div>
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={eyelashExtensions}
              onChange={(e) => setEyelashExtensions(e.target.checked)}
              className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Eyelash Extensions 100 €
          </label>
        </div>

        <div>
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={special}
              onChange={(e) => setSpecial(e.target.checked)}
              className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Special 300 €
          </label>
        </div>

        <h2 className="text-m lg:text-xl font-bold text-BgFont text-center lg:py-4">
          Total Price: {total} €
        </h2>
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-BgPinkMiddle text-BgFont text-lg font-bold hover:bg-BgPinkDark w-full px-2 lg:px-4 py-1 lg:py-2 rounded"
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MakeupForm;
