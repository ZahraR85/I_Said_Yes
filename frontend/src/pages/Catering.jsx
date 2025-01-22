import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useCateringContext } from "../context/CateringContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const Catering = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const { state } = useCateringContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = Object.values(state.features).reduce(
      (sum, feature) => sum + feature.totalPrice,
      0
    );
    setTotal(total);
  }, [state.features]);

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
      const fetchCateringData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/caterings?userID=${userId}`
          );
          if (response.data) {
            setFormData(response.data);
            setIsEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching catering data:", error);
        }
      };
      fetchCateringData();
    }
  }, [userId]);

  // Handle feature selection
  const navigateToFeaturePage = (featureName) => {
    navigate(`/catering/${featureName.toLowerCase()}`, {
      state: { featureName },
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Save catering data
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/caterings`,
        { ...formData, userID: userId }
      );

      // Save shopping cart data
      const shoppingCartData = {
        userID: userId,
        serviceName: "Catering",
        price: total,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shoppingcards`,
        shoppingCartData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Update app context
      addToShoppingCard(shoppingCartData);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Catering ${isEditMode ? "updated" : "created"} successfully!`
        );
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Error saving catering data:", error);
      toast.error("Failed to save data!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Catering Features</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Feature</th>
            <th className="border px-4 py-2">Total Price (€)</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(state.features).map(([feature, { totalPrice }]) => (
            <tr key={feature}>
              <td className="border px-4 py-2">{feature}</td>
              <td className="border px-4 py-2">{totalPrice} €</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigateToFeaturePage(feature)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-bold mt-4">
        Total Catering Price: {total} €
      </h2>
    </div>
  );
};

export default Catering;
