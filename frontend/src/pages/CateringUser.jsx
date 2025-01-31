import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CateringUser = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const [cateringItems, setCateringItems] = useState([]);
  const [cateringUser, setCateringUser] = useState([]); // Default as an empty array
  const [totalPrice, setTotalPrice] = useState(0);
  const [savingOrder, setSavingOrder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  // Fetch catering items
  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings`
        );
        const data = await response.json();
        setCateringItems(data);
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };
    fetchCateringItems();
  }, []);

  // Fetch user's catering order using userId from AppContext
  useEffect(() => {
    if (!userId) return; // Only fetch if userId exists

    const saveCateringOrder = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/cateringusers`,
          {
            userId,
            items: cateringUser.map((item) => ({
              CateringItemID: item._id,
              quantity: item.quantity,
              description: item.description,
              totalPrice: item.price * item.quantity,
            })),
          }
        );

        // Handle successful response here (optional)
        console.log("Catering order saved:", response.data);
        toast.success("Catering order saved successfully!");
      } catch (error) {
        console.error("Error saving catering order:", error);
        toast.error("Error saving catering order.");
      }
    };

    saveCateringOrder();
  }, [userId, cateringUser]); // Re-run if userId or cateringUser changes

  // Add an item to the catering user's order
  const handleAddToCateringUser = (item) => {
    // Check if the item already exists in the cateringUser state
    const itemExists = cateringUser.some(
      (existingItem) => existingItem.CateringItemID === item._id
    );

    if (itemExists) {
      toast.warn("Item already added to the order.");
      return;
    }

    // Add the item if it doesn't exist
    setCateringUser((prevUserItems) => [
      ...prevUserItems,
      { ...item, quantity: 1, description: "" },
    ]);
    updateTotalPrice();
  };

  // Update an item in the catering order
  const handleUpdateItem = (index, newQuantity, newDescription) => {
    const updatedUserItems = [...cateringUser];
    updatedUserItems[index].quantity = newQuantity;
    updatedUserItems[index].description = newDescription;
    setCateringUser(updatedUserItems);
    updateTotalPrice();
  };

  // Update the total price whenever the user's order changes
  const updateTotalPrice = () => {
    const total = cateringUser.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // Save the catering user's order
  const handleSaveCateringUser = async () => {
    if (!userId || savingOrder) return; // Prevent if already saving

    // Prepare the data to be sent
    const orderData = {
      userId,
      items: cateringUser.map((item) => ({
        CateringItemID: item._id,
        quantity: item.quantity,
        description: item.description,
        totalPrice: item.price * item.quantity,
      })),
    };

    try {
      setSavingOrder(true); // Set saving state to true
      console.log("Saving Catering Order:", orderData);

      // Perform the POST request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cateringusers`,
        orderData
      );

      // Handle successful response
      console.log("Catering order saved:", response.data);
      toast.success("Catering order saved successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error saving catering order:", error);
      toast.error("Error saving catering order.");
    } finally {
      setSavingOrder(false); // Reset saving state after request
    }
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter catering items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? cateringItems
      : cateringItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-BgFont mb-6">
        Catering Menu
      </h1>

      {/* Category Filter */}
      <div className="mb-6 text-center">
        <label
          htmlFor="category"
          className="mr-2 font-semibold text-lg text-BgFont"
        >
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-3 py-2 border rounded-lg text-BgFont"
        >
          <option value="All">All</option>
          <option value="starter">Starter</option>
          <option value="maincourse">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="colddrink">Cold Drink</option>
          <option value="cafebar">Cafe Bar</option>
          <option value="fruits">Fruits</option>
          <option value="cake">Cake</option>
          <option value="waiter">Waiter</option>
        </select>
      </div>

      {/* Catering Items Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="border-4 border-BgPinkDark rounded-lg p-4 text-center hover:scale-105 transition-all duration-300 ease-out"
          >
            <img
              src={item.imagePath}
              alt={item.ItemName}
              className="h-40 w-full object-cover rounded mb-4"
            />
            <h3 className="font-bold text-lg text-BgFont">{item.ItemName}</h3>
            <p className="text-BgFont">{item.category}</p>
            <p className="font-semibold text-lg text-BgFont">{item.price} €</p>
            <button
              onClick={() => handleAddToCateringUser(item)}
              className="mt-4 w-full px-4 py-2 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>

      {/* Catering Order Table */}
      <div>
        <h2 className="text-2xl font-bold text-BgFont mb-4">
          Your Catering Order
        </h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-BgFont mb-6">
          <thead>
            <tr className="bg-BgKhaki">
              <th className="border-b p-4">Item</th>
              <th className="border-b p-4">Quantity</th>
              <th className="border-b p-4">Description</th>
              <th className="border-b p-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {cateringUser.length > 0 ? (
              cateringUser.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border-b p-4">{item.ItemName}</td>
                  <td className="border-b p-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(
                          index,
                          +e.target.value,
                          item.description
                        )
                      }
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border-b p-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateItem(index, item.quantity, e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border-b p-4">
                    {(item.price * item.quantity).toFixed(2)} €
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No items in your catering order
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Price */}
        <p className="text-xl font-bold text-BgFont mb-6">
          Total Price: {totalPrice.toFixed(2)} €
        </p>

        {/* Save Order Button */}
        <div className="text-center">
          <button
            onClick={handleSaveCateringUser}
            className="px-6 py-3 bg-BgPinkMiddle text-BgFont font-bold rounded-lg hover:bg-BgPinkDark"
          >
            Save Catering Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CateringUser;
