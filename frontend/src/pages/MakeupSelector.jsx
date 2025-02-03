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
  const [makeupData, setMakeupData] = useState(null);
  const [makeup, setMakeup] = useState("Budget Makeup");
  const [hairstyle, setHairstyle] = useState("Simple Shenyun");
  const [dyeHair, setDyeHair] = useState("Full Hair Color - Short Hair");
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
        setMakeupData(response.data);
        // You can directly set the state from the response, like:
        setMakeup(response.data.makeup);
        setHairstyle(response.data.hairstyle);
        setDyeHair(response.data.dyeHair);
        setNail(response.data.nail.selected);
        setEyelashExtensions(response.data.eyelashExtensions.selected);
        setSpecial(response.data.special.selected);
        setTotal(response.data.total);
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
    setSelectedFeatures((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id]?.selected },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validTotal = isNaN(total) ? 0 : total;
    const data = {
      userID: userId,
      makeup,
      hairstyle,
      dyeHair,
      nail,
      eyelashExtensions,
      special,
      total: validTotal, // Use valid total here
    };

    try {
      const makeupUrl = `${import.meta.env.VITE_API_URL}/makeups`;
      const shoppingCartUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
      const requestData = {
        userID: userId,
        makeup: selectedFeatures.makeup?.selected || false,
        dyeHair: selectedFeatures.dyeHair?.selected || false,
        nail: selectedFeatures.nail?.selected || false,
        hairstyle: selectedFeatures.hairstyle?.selected || false,
        eyelashExtensions:
          selectedFeatures.eyelashExtensions?.selected || false,
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
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <h2>Select your Makeup services that you need:</h2>
      <div>
        <label>Makeup Type:</label>
        <select value={makeup} onChange={(e) => setMakeup(e.target.value)}>
          <option value="Budget Makeup">Budget Makeup</option>
          <option value="Luxury Makeup">Luxury Makeup</option>
          <option value="VIP Makeup">VIP Makeup</option>
        </select>
      </div>

      <div>
        <label>Hairstyle:</label>
        <select
          value={hairstyle}
          onChange={(e) => setHairstyle(e.target.value)}
        >
          <option value="Simple Shenyun">Simple Shenyun</option>
          <option value="Complex Shenyun">Complex Shenyun</option>
          <option value="Babylis">Babylis</option>
          <option value="Extra Hair Extension">Extra Hair Extension</option>
        </select>
      </div>

      <div>
        <label>Dye Hair:</label>
        <select value={dyeHair} onChange={(e) => setDyeHair(e.target.value)}>
          {/* List of hair colors */}
          <option value="Full Hair Color - Short Hair">
            Full Hair Color (Short Hair)
          </option>
          <option value="Full Hair Color - Medium Hair">
            Full Hair Color (Medium Hair)
          </option>
          <option value="Full Hair Color - Long Hair">
            Full Hair Color (Long Hair)
          </option>
          <option value="Full Hair Color - Very Long Hair">
            Full Hair Color (Very Long Hair)
          </option>
          <option value="Highlights - Short Hair">
            Highlights (Short Hair)
          </option>
          <option value="Highlights - Medium Hair">
            Highlights (Medium Hair)
          </option>
          <option value="Highlights - Long Hair">Highlights (Long Hair)</option>
          <option value="Highlights - Very Long Hair">
            Highlights (Very Long Hair)
          </option>
          <option value="Balayage - Short Hair">Balayage (Short Hair)</option>
          <option value="Balayage - Medium Hair">Balayage (Medium Hair)</option>
          <option value="Balayage - Long Hair">Balayage (Long Hair)</option>
          <option value="Balayage - Very Long Hair">
            Balayage (Very Long Hair)
          </option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={nail}
            onChange={(e) => setNail(e.target.checked)}
          />
          Nail
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={eyelashExtensions}
            onChange={(e) => setEyelashExtensions(e.target.checked)}
          />
          Eyelash Extensions
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={special}
            onChange={(e) => setSpecial(e.target.checked)}
          />
          Special
        </label>
      </div>

      <div>
        <h3>Total: ${total}</h3>
      </div>

      <button type="submit">Save</button>
    </form>
  );
};

export default MakeupForm;
