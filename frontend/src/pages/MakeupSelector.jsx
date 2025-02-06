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
      }, 2000);
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
      "Luxury Makeup: Offers a sophisticated, long-lasting finish with premium products designed to enhance natural beauty and provide a flawless appearance. VIP Makeup: Delivers a glamorous, red-carpet-ready look using exclusive, high-end products for special occasions or photo shoots.",
    hairstyle:
      "Simple Shenyun: A sleek and elegant hairstyle that offers a polished, refined look suitable for everyday events. Complex Shenyun: A more intricate and sophisticated hairstyle with elegant twists and volume, perfect for formal occasions. Babylis: A stylish and bouncy look achieved with a professional curling iron, ideal for a vibrant and lively appearance. Extra Hair Extension: Adds length and volume to your hair using high-quality extensions, giving you a fuller, more glamorous look.",
    dyeHair:
      "Pick your preferred hair color or highlights for the perfect finishing touch.",
    nail: "Add nail services to complement your look with manicures and nail art.",
    eyelashExtensions:
      "Enhance your lashes with Semi-permanent synthetic lashes applied individually to your natural lashes to create a fuller, longer, and more dramatic look.",
    special:
      "Includes a personalized skincare routine to prep the bride's skin for flawless makeup and a tanning session to give a natural sun-kissed glow.",
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('https://i.postimg.cc/TwNqd9Bm/makeup2.jpg')]">
      <div className="absolute inset-0 bg-white/60"></div>
      <ToastContainer />
      <div className="relative mx-auto w-full max-w-[calc(85%-170px)] lg:max-w-[calc(60%-200px)] bg-opacity-80 shadow-md rounded-lg p-2 lg:p-8 space-y-5">
        <h2 className="text-lg lg:text-2xl font-bold text-center text-BgFont my-2 lg:mt-6">
          Select your Makeup services that you need:
        </h2>
        {/* Hover Description */}
        <div className="mt-2 bg-BgPink p-2 lg:p-4 text-BgFont rounded min-h-[120px] lg:min-h-[150px] overflow-y-auto">
          <h2 className="text-sm lg:text-lg font-bold">Description:</h2>
          <p className="text-xs lg:text-sm">
            {description || "Hover over an option to see details."}
          </p>
        </div>
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
              className="mr-2  text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Nails 70 €
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
              className="mr-2  text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Eyelash Extensions 100 €
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
              className="mr-2  text-sm lg:text-lg font-semibold lg:font-bold text-BgFont text-center w-5 h-5"
            />
            Special Services 300 €
          </label>
        </div>
        <div>
          <h2 className="text-m lg:text-xl font-bold text-BgFont text-center lg:py-4">
            Total Price: {total} €
          </h2>
        </div>
        <div className="flex justify-center text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-BgPinkMiddle text-BgFont text-lg font-bold hover:bg-BgPinkDark w-full px-2 lg:px-4 py-1 lg:py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeupSelector;
