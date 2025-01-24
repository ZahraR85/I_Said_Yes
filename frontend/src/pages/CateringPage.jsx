import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

const CateringPage = () => {
  const [cateringItems, setCateringItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]); // State to store cart items

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

  const handleAddToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.itemName === item.ItemName
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].totalPrice =
          updatedCart[existingItemIndex].quantity *
          updatedCart[existingItemIndex].price;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          { ...item, quantity, totalPrice: item.price * quantity },
        ];
      }
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
              <tr>
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Item</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{cartItem.category}</td>
                  <td className="border-b p-2">{cartItem.ItemName}</td>
                  <td className="border-b p-2">{cartItem.quantity}</td>
                  <td className="border-b p-2">${cartItem.totalPrice}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-right font-bold">
                  Grand Total:
                </td>
                <td className="font-bold">
                  ${cart.reduce((total, item) => total + item.totalPrice, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div>
        {/* Category Filter */}
        <div className="mb-4">
          <label htmlFor="category" className="mr-2 font-semibold">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border rounded px-4 py-2"
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
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg bg-white shadow-md"
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
              <div>
                <button
                  onClick={() => handleAddToCart(item, 1)}
                  className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkMiddle hover:text-lg hover:bg-BgPinkDark"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => Navigate(`/cateringPage/${item._id}`)}
                  className="m-2 p-2 inline-block text-m font-semibold bg-BgPinkMiddle hover:text-lg hover:bg-BgPinkDark"
                >
                  See Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CateringPage;
