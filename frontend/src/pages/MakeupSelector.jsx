import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const MakeupSelector = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();
  const [makeup, setMakeup] = useState("Budget Makeup");
  const [hairstyle, setHairstyle] = useState("Simple Shenyun");
  const [dyeHair, setDyeHair] = useState("Full Hair Color - Short Hair");
  const [nail, setNail] = useState(false);
  const [eyelashExtensions, setEyelashExtensions] = useState(false);
  const [special, setSpecial] = useState(false);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState(""); // State for description

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

  const updateTotalPrice = () => {
    let total = 0;
    if (makeup === "Budget Makeup") total += 150;
    if (makeup === "Luxury Makeup") total += 300;
    if (makeup === "VIP Makeup") total += 500;
    if (hairstyle === "Simple Shenyun") total += 100;
    if (hairstyle === "Complex Shenyun") total += 150;
    if (hairstyle === "Babylis") total += 100;
    if (hairstyle === "Extra Hair Extension") total += 150;
    if (dyeHair === "Full Hair Color - Short Hair") total += 50;
    if (dyeHair === "Full Hair Color - Medium Hair") total += 80;
    if (dyeHair === "Full Hair Color - Long Hair") total += 120;
    if (dyeHair === "Full Hair Color - Very Long Hair") total += 150;
    if (dyeHair === "Highlights - Short Hair") total += 80;
    if (dyeHair === "Highlights - Medium Hair") total += 120;
    if (dyeHair === "Highlights - Long Hair") total += 160;
    if (dyeHair === "Highlights - Very Long Hair") total += 200;
    if (dyeHair === "Balayage - Short Hair") total += 100;
    if (dyeHair === "Balayage - Medium Hair") total += 200;
    if (dyeHair === "Balayage - Long Hair") total += 300;
    if (dyeHair === "Balayage - Very Long Hair") total += 400;
    if (nail) total += 70;
    if (eyelashExtensions) total += 100;
    if (special) total += 300;
    setTotal(total);
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

  useEffect(() => {
    updateTotalPrice();
  }, [makeup, hairstyle, dyeHair, nail, eyelashExtensions, special]);

  const descriptions = {
    makeup:
      "Choose a makeup type that suits your style and budget. Budget, luxury, or VIP options available.",
    hairstyle:
      "Select a hairstyle that matches your look. From simple styles to extravagant options.",
    dyeHair:
      "Pick your preferred hair color or highlights for the perfect finishing touch.",
    nail: "Add nail services to complement your look with manicures and nail art.",
    eyelashExtensions:
      "Enhance your lashes for a bold, dramatic effect with our eyelash extension services.",
    special:
      "Opt for additional special services to complete your beauty transformation with a touch of luxury.",
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('https://i.postimg.cc/TwNqd9Bm/makeup2.jpg')]">
      <div className="absolute inset-0 bg-white/60"></div>
      <ToastContainer />
      <div className="relative mx-auto w-full max-w-[calc(85%-170px)] lg:max-w-[calc(60%-200px)] bg-opacity-80 shadow-md rounded-lg p-4 sm:p-8 space-y-5">
        {/* Display description text */}
        <div className="text-center mb-4 text-lg font-semibold text-BgFont">
          {description}
        </div>

        <h2 className="text-lg lg:text-2xl font-bold text-center text-BgFont my-1 lg:my-16">
          Select your Makeup services that you need:
        </h2>
        <div
          onMouseEnter={() => setDescription(descriptions.makeup)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Makeup Type:
          </label>
          <select
            value={makeup}
            onChange={(e) => {
              setMakeup(e.target.value);
              updateTotalPrice();
            }}
            className="p-1 lg:p-2 w-[350px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
          >
            <option value="Budget Makeup">Budget Makeup 150 €</option>
            <option value="Luxury Makeup">Luxury Makeup 300 €</option>
            <option value="VIP Makeup">VIP Makeup 500 €</option>
          </select>
        </div>

        <div
          onMouseEnter={() => setDescription(descriptions.hairstyle)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Hairstyle:
          </label>
          <select
            value={hairstyle}
            onChange={(e) => {
              setHairstyle(e.target.value);
              updateTotalPrice();
            }}
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

        <div
          onMouseEnter={() => setDescription(descriptions.dyeHair)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="mr-2 text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            Dye Hair:
          </label>
          <select
            value={dyeHair}
            onChange={(e) => {
              setDyeHair(e.target.value);
              updateTotalPrice();
            }}
            className="p-1 lg:p-2 w-[350px] border border-BgKhaki focus:outline-none focus:ring focus:ring-BgKhaki rounded-md bg-transparent"
          >
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

        <div
          onMouseEnter={() => setDescription(descriptions.nail)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={nail}
              onChange={(e) => {
                setNail(e.target.checked);
                updateTotalPrice();
              }}
              className="mr-2"
            />
            Add Nails 70 €
          </label>
        </div>

        <div
          onMouseEnter={() => setDescription(descriptions.eyelashExtensions)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={eyelashExtensions}
              onChange={(e) => {
                setEyelashExtensions(e.target.checked);
                updateTotalPrice();
              }}
              className="mr-2"
            />
            Add Eyelash Extensions 100 €
          </label>
        </div>

        <div
          onMouseEnter={() => setDescription(descriptions.special)}
          onMouseLeave={() => setDescription("")}
        >
          <label className="text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center">
            <input
              type="checkbox"
              checked={special}
              onChange={(e) => {
                setSpecial(e.target.checked);
                updateTotalPrice();
              }}
              className="mr-2"
            />
            Add Special Services 300 €
          </label>
        </div>

        <div className="flex justify-center text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-BgBtnHover hover:bg-BgHoverFocus px-6 py-3 rounded-lg shadow-md text-white text-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeupSelector;
