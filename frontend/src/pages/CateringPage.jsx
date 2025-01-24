import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CateringPage = () => {
  const [cateringItems, setCateringItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catering Menu</h1>

      {/* Display Cart Table */}
      {cart.length > 0 && (
        <div className="mb-6">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-BgPinkMiddle text-white">
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Item</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Description</th>
                <th className="border-b p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem, index) => (
                <tr key={index} className="bg-BgPinkLight hover:bg-BgPinkDark">
                  <td className="border-b p-2">{cartItem.category}</td>
                  <td className="border-b p-2">{cartItem.ItemName}</td>
                  <td className="border-b p-2">
                    <input
                      type="number"
                      value={cartItem.quantity}
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
                      value={cartItem.description}
                      placeholder="Add a description"
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border-b p-2">
                    ${(cartItem.quantity * cartItem.price).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-200">
                <td colSpan="4" className="text-right">
                  Grand Total:
                </td>
                <td>
                  $
                  {cart
                    .reduce(
                      (total, item) => total + item.quantity * item.price,
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="category" className="mr-2 font-semibold">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-4 py-2 bg-BgPinkMiddle text-white"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg bg-white shadow-md hover:shadow-lg"
          >
            <img
              src={item.imagePath}
              alt={item.ItemName}
              className="h-40 w-full object-cover rounded-t"
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
              className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkMiddle hover:bg-BgPinkDark text-white rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate(`/cateringPage/${item._id}`)}
              className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkDark hover:bg-BgPinkMiddle text-white rounded"
            >
              See Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CateringPage;
