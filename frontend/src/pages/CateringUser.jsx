import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
const CateringUser = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userId) {
      const fetchItems = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/caterings`
          );

          // Ensure response.data is an array before setting state
          if (Array.isArray(response.data)) {
            setItems(response.data);
          } else {
            console.error("Unexpected API response format:", response.data);
            setItems([]); // Set to empty array to avoid errors
          }
        } catch (err) {
          console.error("Error fetching catering items:", err);
          setItems([]); // Set to empty array on error
        }
      };

      fetchItems();
    }
  }, [userId]); // Dependency array contains userId

  useEffect(() => {
    if (userId) {
      const fetchUserCateringItems = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/cateringusers/${userId}`
          );

          if (response.data && Array.isArray(response.data.items)) {
            // Map over the items and include the populated details (ItemName, category, price)
            const itemsWithDetails = response.data.items.map((item) => {
              const { cateringItemId } = item; // Destructure to access populated catering item
              return {
                ...item, // Contains the user's selected item details
                cateringItemId: {
                  ...cateringItemId, // Includes populated details like ItemName, category, and price
                },
              };
            });

            setSelectedItems(itemsWithDetails); // Update the state with the populated item data
          } else {
            console.error("Unexpected API response format:", response.data);
            setSelectedItems([]);
          }
        } catch (err) {
          console.error("Error fetching user's catering items:", err);
          setSelectedItems([]);
        }
      };

      fetchUserCateringItems();
    }
  }, [userId]);

  useEffect(() => {
    setTotalPrice(
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    );
  }, [selectedItems]);

  const handleAddItem = async (item) => {
    const existingIndex = selectedItems.findIndex(
      (i) => i.cateringItemId._id === item._id
    );

    if (existingIndex !== -1) {
      // Update item quantity and description
      const updatedItems = [...selectedItems];
      updatedItems[existingIndex].quantity += 1;
      setSelectedItems(updatedItems);

      // Update item on the server
      try {
        const totalPrice = updatedItems[existingIndex].quantity * item.price;
        // Ensure totalPrice is a valid number
        if (isNaN(totalPrice) || totalPrice < 0) {
          throw new Error("Invalid total price");
        }

        await axios.put(
          `${import.meta.env.VITE_API_URL}/cateringusers/${userId}`,
          {
            items: [
              {
                cateringItemId: item._id,
                quantity: updatedItems[existingIndex].quantity,
                description: updatedItems[existingIndex].description,
                price: item.price,
              },
            ],
          }
        );
      } catch (err) {
        console.error(
          "Error updating item:",
          err.response?.data || err.message
        );
      }
    } else {
      // Add new item to the selected list
      const totalPrice = item.price; // New item starts with 1 quantity
      if (isNaN(totalPrice) || totalPrice < 0) {
        console.error("Invalid total price for new item");
        return; // Exit if the price is invalid
      }

      const newItem = {
        ...item,
        cateringItemId: item._id,
        quantity: 1,
        description: "",
        totalPrice: totalPrice, // Set totalPrice
      };

      setSelectedItems((prevItems) => [...prevItems, newItem]);

      // Send new item to the server
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/cateringusers`, {
          userId,
          items: [newItem], // Add new item to user's catering order
        });
      } catch (err) {
        console.error("Error adding item:", err.response?.data || err.message);
      }
    }
  };

  const handleQuantityChange = async (index, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative or zero quantity

    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);

    try {
      const totalPrice =
        updatedItems[index].quantity * updatedItems[index].price;

      // Ensure totalPrice is a valid number
      if (isNaN(totalPrice) || totalPrice < 0) {
        throw new Error("Invalid total price");
      }

      // Send the updated quantity and description (if any) to the backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cateringusers/${userId}/${
          updatedItems[index].cateringItemId._id
        }`, // cateringItemId._id will be used to find the correct item to update
        {
          //cateringItemId: updatedItems[index].item._id,
          quantity: newQuantity,
          description: updatedItems[index].description, // Keep description unchanged
        }
      );
    } catch (err) {
      console.error(
        "Error updating item quantity:",
        err.response?.data || err.message
      );
    }
  };
  const handleDescriptionChange = async (index, newDescription) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].description = newDescription;
    setSelectedItems(updatedItems);

    try {
      // Send the updated description and quantity (unchanged) to the backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cateringusers/${userId}/${
          updatedItems[index].cateringItemId._id
        }`, // cateringItemId._id will be used to find the correct item to update
        {
          //cateringItemId: updatedItems[index].item._id,
          quantity: updatedItems[index].quantity, // Keep quantity unchanged
          description: newDescription,
        }
      );
    } catch (err) {
      console.error(
        "Error updating item description:",
        err.response?.data || err.message
      );
    }
  };

  const handleRemoveItem = async (index, item) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    console.log("Deleting item with cateringItemId:", item.cateringItemId);

    try {
      // Send DELETE request with userId and cateringItemId
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cateringusers/${userId}/${
          item.cateringItemId._id
        }`
      );

      // Remove the item from the selected items list in the frontend
      setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));

      console.log("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cateringusers`,
        {
          userId,
          items: selectedItems,
        }
      );
      alert(response.data.message);
    } catch (err) {
      setError("Error saving the catering order.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredItems = Array.isArray(items)
    ? selectedCategory === "All"
      ? items
      : items.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
    : [];

  // Calculate the grand total dynamically
  const grandTotal = selectedItems.reduce((total, item) => {
    return total + (item.cateringItemId?.price * item.quantity || 0);
  }, 0);

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-BgFont text-center m-6">
        Select your favorite Menu from here
      </h1>

      {selectedItems.length > 0 && (
        <div className="mb-6">
          <table className="min-w-full table-auto border border-gray-300 text-center text-BgFont">
            <thead>
              <tr className="bg-BgKhaki text-BgFont">
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Description</th>
                <th className="border-b p-2">Price</th>
                <th className="border-b p-2">Total Price</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="border-b p-2">
                    {item.cateringItemId?.category || item.category || "N/A"}
                  </td>
                  <td className="border-b p-2">
                    {item.cateringItemId?.ItemName || item.ItemName || "N/A"}
                  </td>
                  <td className="border-b p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="border rounded px-2 py-1 w-16"
                    />
                  </td>
                  <td className="border-b p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border-b p-2">
                    {item.cateringItemId?.price || item.price || "N/A"} €
                  </td>
                  <td className="border-b p-2">
                    {item.cateringItemId?.price * item.quantity ||
                      item.totalPrice}
                    €
                  </td>
                  <td className="border-b p-2">
                    <button onClick={() => handleRemoveItem(index, item)}>
                      <FaTrash className="text-red-400 text-lg cursor-pointer hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-right font-bold p-4">
                  Grand Total:
                </td>
                <td className="font-bold text-red-500">
                  {grandTotal.toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="m-4 font-bold text-center text-BgFont">
        <label htmlFor="category" className="mr-2 text-lg">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-1/5 text-center p-2 text-m border border-BgPinkDark rounded"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-BgFont text-center">
        {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="border-4 border-BgPinkDark rounded-lg"
            >
              <img
                src={item.imagePath}
                alt={item.ItemName}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="text-lg font-bold">{item.ItemName}</h2>
              <p>{item.category}</p>
              <p className="font-bold">{item.price} €</p>
              <button
                onClick={() => handleAddItem(item)}
                className="m-2 p-2 bg-BgPinkMiddle hover:bg-BgPinkDark rounded"
              >
                Add to List
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No items available</p>
        )}
      </div>
    </div>
  );
};

export default CateringUser;
