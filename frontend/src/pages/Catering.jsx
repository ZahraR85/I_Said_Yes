import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const features = [
  {
    name: "Starter",
    price: 10,
    description:
      " Contains Onion Rings, Chicken Wings, Fish and Chips, Mozzarella Sticks, and Stuffed Mushrooms. Available in classic, spicy, gluten-free, keto-friendly, and kids’ special models.",
  },
  {
    name: "MainCourse",
    price: 15,
    description:
      "Includes Grilled Chicken Breast, Beef Steak, Vegetarian Lasagna, Shrimp Alfredo, and Lamb Chops. Options available are gourmet, low-calorie, vegan, BBQ-style, and international fusion.",
  },
  {
    name: "Dessert",
    price: 6,
    description:
      "Features Chocolate Fudge Cake, Strawberry Cheesecake, Ice Cream Sundaes, Tiramisu, and Crème Brûlée. Available in sugar-free, classic, seasonal fruits, mini-portions, and deluxe servings.",
  },
  {
    name: "ColdDrink",
    price: 5,
    description:
      "Offers Cola, Lemonade, Iced Tea, Fruit Punch, and Sparkling Water. Variants include diet, classic, natural sweeteners, carbonated, and alcohol-free mocktail mixes.",
  },
  {
    name: "CafeBar",
    price: 4,
    description:
      "Provides Espresso, Cappuccino, Latte, Hot Chocolate, and Iced Coffee. Choose from regular, decaf, organic, blended flavors (vanilla, hazelnut), and extra-strong options.",
  },
  {
    name: "Fruits",
    price: 5,
    description:
      "Features Fresh Apple Slices, Banana Halves, Orange Wedges, Berries Mix, and Exotic Fruit Platters. Available in seasonal selections, tropical medleys, organic, dried fruits mix, and cocktail garnish sets.",
  },
  {
    name: "Cake",
    price: 3,
    description:
      "Includes Vanilla Sponge, Chocolate Truffle, Red Velvet, Carrot Cake, and Black Forest. Variants include personalized designs, mini cupcakes, layered cakes, gluten-free, and special occasion cakes.",
  },
  {
    name: "Waiter",
    price: 20,
    description:
      "Services include Table Serving, Buffet Assistance, Beverage Refills, Special Requests Handling, and Cleanup Support. Models offered are standard service, premium service, international cuisine experts, event-specific attire, and multilingual waitstaff.",
  },
];

const Catering = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Starter: 0,
    MainCourse: 0,
    Dessert: 0,
    ColdDrink: 0,
    CafeBar: 0,
    Fruits: 0,
    Cake: 0,
    Waiter: 0,
  });

  const [total, setTotal] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [description, setDescription] = useState(
    "This Price is the base price per each Person as deposit. We have variety of Menu for Starter which can see in our Menu Form. Select a feature to see its description here!"
  );

  // Redirect to SignIn if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);
  // Fetch existing data for the user
  useEffect(() => {
    if (userId) {
      const fetchReceptionData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/caterings?userID=${userId}`
          );
          if (response.data) {
            const normalizedData = features.reduce((acc, feature) => {
              acc[feature.name] = response.data[feature.name]?.Number || 0;
              return acc;
            }, {});
            setFormData({ ...normalizedData });
            setIsEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching reception data:", error);
          //toast.warn("please add your entertain");
        }
      };
      fetchReceptionData();
    }
  }, [userId]);

  // Calculate total price dynamically
  useEffect(() => {
    const total = features.reduce((sum, feature) => {
      return sum + formData[feature.name] * feature.price;
    }, 0);
    setTotal(total);
  }, [formData]);

  // Handle input change for the reception features
  const handleChange = (e, featureName) => {
    const value = Math.max(0, parseInt(e.target.value) || 0); // Ensure non-negative numbers
    setFormData((prev) => ({ ...prev, [featureName]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/caterings`; // Same URL for both create and update
      const response = await axios({
        method: "POST", // Always use POST for both actions
        url,
        data: { ...formData, userID: userId }, // Send userId and reception data
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
          serviceName: "Catering",
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
          //navigate("/shoppingCard");
        }, 3000);
      } else {
        toast.error("Failed to save data!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data!");
    }
  };
  const navigateToFeaturePage = (featureName) => {
    navigate(`/catering/${featureName.toLowerCase()}`, {
      state: { featureName },
    });
  };

  return (
    <div className="flex justify-center items-start pt-20 min-h-screen bg-[url('./images/catering.png')] bg-cover bg-center">
      <ToastContainer />
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full text-center p-4 sm:p-8 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <h1 className="text-2xl sm:text-3xl text-center text-BgFont font-bold m-4 sm:m-10">
          Select your Catering features:
        </h1>
        <p className="text-sm sm:text-m text-BgFont font-semibold text-center mb-4 sm:mb-8">
          {description}
        </p>
        <button
          onClick={() => navigate("/Menu")}
          className="w-3/5 text-m lg:text-xl bg-BgPinkMiddle text-BgFont font-bold py-2 px-4 rounded hover:bg-BgPinkDark"
        >
          Click here to See our Menu
        </button>

        <table className="table-auto text-BgFont w-full border-collapse border border-BgFont">
          <thead>
            <tr>
              <th className="border border-BgFont px-2 sm:px-4 py-2 text-xs sm:text-base">
                Feature
              </th>
              <th className="border border-BgFont px-2 sm:px-4 py-2 text-xs sm:text-base">
                Minimum Price (€/person)
              </th>
              <th className="border border-BgFont px-2 sm:px-4 py-2 text-xs sm:text-base">
                sum of price
              </th>
              <th className="border border-BgFont px-2 sm:px-4 py-2 text-xs sm:text-base">
                choose from here
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr
                key={feature.name}
                onMouseEnter={() => setDescription(feature.description)}
                onMouseLeave={() =>
                  setDescription(
                    "This price here is the basic price per person as a deposit. We have a variety of menu for the each part, which you can see in our menu form by click on the button. You also can select a feature to see its description here!"
                  )
                }
                className="hover:bg-BgPink"
              >
                <td className="border border-gray-300 text-center px-2 sm:px-4 py-2 text-xs sm:text-base">
                  {feature.name}
                </td>
                <td className="border border-gray-300 text-center px-2 sm:px-4 py-2 text-xs sm:text-base">
                  {feature.price} €
                </td>
                <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">
                  {formData[feature.name]?.price || 0} €
                </td>
                <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">
                  <button
                    onClick={() => navigateToFeaturePage(feature.name)}
                    className="bg-BgPinkMiddle text-BgFont font-bold py-2 px-4 rounded hover:bg-BgPinkDark"
                  >
                    {feature.name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-lg sm:text-xl text-BgFont font-bold mt-4 sm:mt-6">
          Total Price: {total} €
        </h2>
        <button
          onClick={handleSubmit}
          className="w-full bg-BgPinkMiddle text-BgFont font-bold py-2 px-4 rounded hover:bg-BgPinkDark sm:w-auto"
        >
          {isEditMode ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Catering;
