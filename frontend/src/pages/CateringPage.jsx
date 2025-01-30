import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const CateringPage = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const [cateringItems, setCateringItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [editMode, setEditMode] = useState(null);
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
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings`
        );
        const data = await response.json();
        setCateringItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };

    fetchCateringItems();
  }, []);

  useEffect(() => {
    const fetchUserCart = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/cateringselections/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          const userCart = data.selectedItems.flatMap((category) =>
            category.items.map((item) => ({
              ...item,
              category: category.category,
              categoryTotalPrice: category.categoryTotalPrice,
            }))
          );
          setCart(userCart);
        }
      } catch (error) {
        console.error("Error fetching user's catering selections:", error);
      }
    };

    fetchUserCart();
  }, [userId]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredItems(cateringItems);
    } else {
      const filtered = cateringItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to the first page when category changes
  };

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
  // Delete row from the List Table
  const handleDeleteRow = async (index) => {
    const itemToDelete = cart[index];
    if (!itemToDelete || !itemToDelete.cateringItemId) {
      toast.error("Invalid item.");
      return;
    }
    // Check if cateringItemId is an object, and if so, access its _id property
    const cateringItemId = itemToDelete.cateringItemId._id
      ? itemToDelete.cateringItemId._id.toString() // Extract _id and convert to string
      : itemToDelete.cateringItemId.toString(); // If it's already a string, convert it
    //console.log("Converted cateringItemId:", cateringItemId);
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); // Remove item locally

    try {
      // Make the delete request to the backend
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/cateringselections/${userId}/${cateringItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCart(updatedCart); // Update frontend state if backend deletion succeeds
        toast.success("Item removed successfully.");

        // If the cart is empty after deletion, delete the whole catering selection
        if (updatedCart.length === 0) {
          const deleteAllResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/cateringselections/${userId}`,
            {
              method: "DELETE",
            }
          );

          if (deleteAllResponse.ok) {
            toast.success("All items removed. Catering selection deleted.");
          } else {
            toast.error("Failed to delete catering selection.");
          }
        }
      } else {
        console.error("Failed to delete item from backend.");
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.ItemName === item.ItemName
      );
      if (existingItemIndex !== -1) {
        return prevCart; // Prevent duplicates
      }
      return [...prevCart, { ...item, quantity: 1, description: "" }];
    });
  };

  const handleQuantityChange = (index, quantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = quantity;
      return updatedCart;
    });
  };

  const handleDescriptionChange = (index, description) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].description = description;
      return updatedCart;
    });
  };

  const handleSave = async (index) => {
    if (!userId) {
      console.error("User ID is undefined. Cannot save catering details.");
      toast.error("Unable to save: User not identified.");
      return;
    }
    const updatedCart = [...cart];
    setCart(updatedCart);

    const selectedItems = updatedCart.map((item) => ({
      category: item.category,
      items: [
        {
          cateringItemId: item._id,
          ItemName: item.ItemName, // Corrected here
          quantity: item.quantity,
          price: item.price,
          description: item.description,
        },
      ],
      categoryTotalPrice: item.quantity * item.price,
    }));

    const grandTotal = updatedCart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cateringselections/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedItems, grandTotal }),
        }
      );

      if (response.ok) {
        console.log("Catering details saved successfully.");
      } else {
        console.error("Failed to save catering details.");
      }
    } catch (error) {
      console.error("Error saving catering details:", error);
    }
    setEditMode(null);
  };
  const handleShoppingCard = async () => {
    try {
      const shoppingCartUrl = `${import.meta.env.VITE_API_URL}/shoppingcards`;
      const grandTotal = cart.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      const shoppingCartData = {
        userID: userId,
        serviceName: "Catering",
        price: grandTotal,
      };

      await axios.post(shoppingCartUrl, shoppingCartData, {
        headers: { "Content-Type": "application/json" },
      });
      // Frontend-only addition (optional if the backend handles the cart data)
      addToShoppingCard(shoppingCartData);
      toast.success(
        "Catering service added to your shopping cart successfully!"
      );
      setTimeout(() => {
        navigate("/shoppingCard");
      }, 2000);
    } catch (error) {
      console.error("Error adding to shopping cart:", error);
      toast.error("Failed to add to shopping cart.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-BgFont text-center m-6">
        Select your favorite Menu from here
      </h1>

      {cart.length > 0 && (
        <div className="mb-6">
          <table className="min-w-full table-auto border border-gray-300 text-center text-BgFont">
            <thead className="text-sm lg:text-m">
              <tr className="bg-BgKhaki text-BgFont">
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Name of Items</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Description</th>
                <th className="border-b p-2">Total Price</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-m">
              {cart.map((cartItem, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="border-b p-2">{cartItem.category}</td>
                  <td className="border-b p-2">{cartItem.ItemName}</td>
                  <td className="border-b p-2">
                    {editMode === index ? (
                      <input
                        type="number"
                        value={cartItem.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value))
                        }
                        className="border rounded px-2 py-1 w-16"
                      />
                    ) : (
                      cartItem.quantity
                    )}
                  </td>
                  <td className="border-b p-2">
                    {editMode === index ? (
                      <input
                        type="text"
                        value={cartItem.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      cartItem.description
                    )}
                  </td>
                  <td className="border-b p-2">
                    {(cartItem.quantity * cartItem.price).toFixed(2)} €
                  </td>
                  <td className="border-b p-2">
                    {editMode === index ? (
                      <button
                        onClick={() => handleSave(index)}
                        className="px-2 py-1 lg:px-4 lg:py-2 bg-LightGold font-bold text-BgFont hover:bg-DarkGold rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditMode(index)}
                        className="px-2 py-1 lg:px-4 lg:py-2 bg-BgPinkMiddle font-bold text-BgFont hover:bg-BgPinkDark rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button>
                      <FaTrash
                        className="ml-4 text-red-400 text-lg lg:text-2xl cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteRow(index)}
                        title="Delete"
                      />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-right font-bold p-4">
                  Grand Total:
                </td>
                <td className="font-bold text-red-500">
                  {cart
                    .reduce(
                      (total, item) => total + item.quantity * item.price,
                      0
                    )
                    .toFixed(2)}{" "}
                  €
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleShoppingCard}
              className="w-2/3 px-4 py-2 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark hover:text-xl"
            >
              Add to Shopping Cart
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div>
        <div className="m-4 lg:my-6 font-bold text-center text-BgFont">
          <label htmlFor="category" className="mr-2 text-lg lg:text-xl">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-1/5 text-center lg:mb-4 mb-2 lg:p-2 p-1 text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark "
          >
            <option value="all">All</option>
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
          {currentItems.map((item) => (
            <div
              key={item._id}
              className="border-4 border-BgPinkDark rounded-lg cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
            >
              <img
                src={item.imagePath}
                alt={item.ItemName}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="text-m lg:text-lg font-bold px-2 lg:px-4 mt-2">
                {item.ItemName}
              </h2>
              <p className="text-m px-2 lg:px-4">{item.category}</p>
              <p className="font-bold text-m lg:text-lg px-2 lg:px-4">
                {item.price} €
              </p>
              <button
                onClick={() => handleAddToCart(item)}
                className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkMiddle hover:bg-BgPinkDark rounded"
              >
                Add to List
              </button>
              <button
                onClick={() => navigate(`/cateringPage/${item._id}`)}
                className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkMiddle hover:bg-BgPinkDark rounded"
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 lg:mt-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-BgPinkMiddle text-BgFont rounded-l hover:bg-BgPinkDark"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-BgFont">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-BgPinkMiddle text-BgFont rounded-r hover:bg-BgPinkDark"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CateringPage;
