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
  //const [editMode, setEditMode] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page (can be changed)

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

    const grandTotal = selectedItems.reduce(
      (total, selectedItem) =>
        total + selectedItem.quantity * selectedItem.price,
      0
    );

    if (existingIndex !== -1) {
      // Update item quantity and description
      const updatedItems = [...selectedItems];
      updatedItems[existingIndex].quantity += 1;
      setSelectedItems(updatedItems);

      // Update item on the server
      try {
        const totalPrice = updatedItems[existingIndex].quantity * item.price;
        if (isNaN(totalPrice) || totalPrice < 0) {
          throw new Error("Invalid total price");
        }

        // Update catering order on the server
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

        // Add the updated catering data to the shopping cart
        const shoppingCartData = {
          userID: userId,
          serviceName: "Catering",
          price: grandTotal,
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/shoppingcards`,
          shoppingCartData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Optional: Add to frontend shopping cart state
        addToShoppingCard(shoppingCartData);

        toast.success(
          "Catering service added to your shopping cart successfully!"
        );
      } catch (err) {
        console.error(
          "Error updating item:",
          err.response?.data || err.message
        );
        toast.error("Failed to update catering item.");
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
        price: item.price,
        totalPrice: totalPrice, // Set totalPrice
      };

      setSelectedItems((prevItems) => [...prevItems, newItem]);

      // Send new item to the server
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/cateringusers`, {
          userId,
          items: [newItem], // Add new item to user's catering order
        });

        // Add the new catering data to the shopping cart
        const shoppingCartData = {
          userID: userId,
          serviceName: "Catering",
          price: grandTotal,
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/shoppingcards`,
          shoppingCartData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Optional: Add to frontend shopping cart state
        addToShoppingCard(shoppingCartData);

        toast.success(
          "Catering service added to your shopping cart successfully!"
        );
      } catch (err) {
        console.error("Error adding item:", err.response?.data || err.message);
        toast.error("Failed to add item to catering order.");
      }
    }
  };

  const handleQuantityChange = async (index, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantity

    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);

    try {
      const totalPrice =
        updatedItems[index].quantity * updatedItems[index].price;
      if (isNaN(totalPrice) || totalPrice < 0) {
        throw new Error("Invalid total price");
      }

      // Ensure cateringItemId is a string
      const cateringItemId =
        updatedItems[index].cateringItemId?._id || updatedItems[index]._id;

      if (!cateringItemId || typeof cateringItemId !== "string") {
        throw new Error("cateringItemId is missing or not a valid string");
      }

      // Update the catering item quantity on the server
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/cateringusers/${userId}/${cateringItemId}`,
        {
          quantity: newQuantity,
          description: updatedItems[index].description,
          totalPrice, // Ensure totalPrice is sent
        }
      );

      // Update shopping cart with the new total price
      const grandTotal = selectedItems.reduce((total, item) => {
        return (
          total +
          (item.cateringItemId?.price * item.quantity ||
            item.price * item.quantity ||
            0)
        );
      }, 0);

      const shoppingCartData = {
        userID: userId,
        serviceName: "Catering",
        price: grandTotal,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/shoppingcards`,
        shoppingCartData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Optional: Add to frontend shopping cart state
      addToShoppingCard(shoppingCartData);

      toast.success("Catering item quantity updated successfully!");
    } catch (err) {
      console.error(
        "Error updating item quantity:",
        err.response?.data || err.message
      );
      toast.error("Failed to update catering item.");
    }
  };

  const handleDescriptionChange = async (index, newDescription) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].description = newDescription;
    setSelectedItems(updatedItems);

    try {
      // Ensure cateringItemId is a string
      const cateringItemId =
        updatedItems[index].cateringItemId?._id || updatedItems[index]._id;

      if (!cateringItemId || typeof cateringItemId !== "string") {
        throw new Error("cateringItemId is missing or not a valid string");
      }

      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/cateringusers/${userId}/${cateringItemId}`,
        {
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

      // Remove the item from the selected items list in the frontend
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1); // Remove the item from the list
      setSelectedItems(updatedItems);
      // Recalculate grand total after item removal
      const grandTotal = updatedItems.reduce((total, item) => {
        return (
          total +
          (item.cateringItemId?.price * item.quantity ||
            item.price * item.quantity ||
            0)
        );
      }, 0);

      const shoppingCartData = {
        userID: userId,
        serviceName: "Catering",
        price: grandTotal,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/shoppingcards`,
        shoppingCartData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Optional: Add to frontend shopping cart state
      addToShoppingCard(shoppingCartData);

      toast.success("Catering item removed successfully and cart updated!");
    } catch (err) {
      console.error("Error deleting item:", err.response?.data || err.message);
      toast.error("Failed to remove catering item or update shopping cart.");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page when category changes
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
    return (
      total +
      (item.cateringItemId?.price * item.quantity ||
        item.price * item.quantity ||
        0)
    );
  }, 0);
  // Get the items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  // Pagination Controls
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="lg:p-6 p-2">
      <ToastContainer />
      <h1 className="text-lg lg:text-2xl font-bold text-BgFont text-center lg:m-6 m-2">
        Select your favorite Menu from here
      </h1>

      {selectedItems.length > 0 && (
        <div className="lg:mb-6 mb-2">
          <table className="min-w-full table-auto border border-gray-300 text-center text-BgFont">
            <thead>
              <tr className="bg-BgKhaki text-custom lg:text-m text-BgFont">
                <th className="border-b lg:p-2 p-1">Category</th>
                <th className="border-b lg:p-2 p-1">Name</th>
                <th className="border-b lg:p-2 p-1">Quantity</th>
                <th className="border-b lg:p-2 p-1">Description</th>
                <th className="border-b lg:p-2 p-1">Price</th>
                <th className="border-b lg:p-2 p-1">Total Price</th>
                <th className="border-b lg:p-2 p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr
                  key={index}
                  className="bg-gray-50 text-custom lg:text-m text-BgFont"
                >
                  <td className="border-b lg:p-2 p-1">
                    {item.cateringItemId?.category || item.category || "N/A"}
                  </td>
                  <td className="border-b lg:p-2 p-1">
                    {item.cateringItemId?.ItemName || item.ItemName || "N/A"}
                  </td>
                  <td className="border-b lg:p-2 p-1">
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
                  <td className="border-b lg:p-2 p-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border-b lg:p-2 p-1">
                    {item.cateringItemId?.price || item.price || "N/A"} €
                  </td>
                  <td className="border-b lg:p-2 p-1">
                    {item.cateringItemId?.price * item.quantity ||
                      item.price * item.quantity ||
                      item.totalPrice}
                    €
                  </td>
                  <td className="border-b lg:p-2 p-1">
                    <button onClick={() => handleRemoveItem(index, item)}>
                      <FaTrash className="text-red-400 text-lg cursor-pointer hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  className="text-right font-bold lg:p-4 p-2 text-sm lg:text-lg"
                >
                  Grand Total:
                </td>
                <td className="font-bold text-red-500 lg:p-4 p-2 text-sm lg:text-lg">
                  {grandTotal.toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="m-4 font-bold text-center text-BgFont">
        <label htmlFor="category" className="mr-2 text-sm lg:text-lg">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-1/5 text-center p-2 text-sm lg:text-lg border border-BgPinkDark rounded"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-BgFont text-center">
        {Array.isArray(currentItems) && currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={item._id}
              className="border-4 border-BgPinkDark rounded-lg"
            >
              <img
                src={item.imagePath}
                alt={item.ItemName}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="text-sm lg:text-lg font-bold">{item.ItemName}</h2>
              <p className="text-sm lg:text-lg">{item.category}</p>
              <p className="text-sm lg:text-lg font-bold ">{item.price} €</p>
              <button
                onClick={() => handleAddItem(item)}
                className="lg:m-2 lg:p-2 m-1 py-1 px-2 text-sm lg:text-lg lg:font-bold font-semibold bg-BgPinkMiddle hover:bg-BgPinkDark rounded"
              >
                Add to List
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No items available</p>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 lg:mt-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="lg:px-4 lg:py-2 px-2 py-1 lg:font-bold font-semibold text-sm lg:text-m bg-BgPinkMiddle text-BgFont rounded-l hover:bg-BgPinkDark"
        >
          Previous
        </button>
        <span className="lg:px-4 lg:py-2 px-2 py-1 text-sm lg:text-m text-BgFont">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="lg:px-4 lg:py-2 px-2 py-1 lg:font-bold font-semibold text-sm lg:text-m disabled:opacity-50 bg-BgPinkMiddle text-BgFont rounded-r hover:bg-BgPinkDark"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CateringUser;
