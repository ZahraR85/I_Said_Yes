import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Catering = () => {
  const [cateringItems, setCateringItems] = useState([]); // All catering items
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items based on category
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default category
  const [quantities, setQuantities] = useState({}); // Quantity for each item

  const navigate = useNavigate();

  // Fetch all catering items
  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings`
        );
        const data = await response.json();
        setCateringItems(data);
        setFilteredItems(data); // Set all items initially
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };

    fetchCateringItems();
  }, []);

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredItems(cateringItems);
    } else {
      const filtered = cateringItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: quantity,
    }));
  };

  // Handle save button
  const handleSave = (item) => {
    const selectedQuantity = quantities[item._id] || 0;
    console.log(`Saved item: ${item.ItemName}, Quantity: ${selectedQuantity}`);
    // You can add the logic to save the selected item to the shopping cart or server here
  };

  // Handle save all button
  const handleSaveAll = () => {
    // Logic for saving all selected items
    Object.keys(quantities).forEach((itemId) => {
      const item = cateringItems.find((item) => item._id === itemId);
      const selectedQuantity = quantities[itemId];
      console.log(
        `Saved item: ${item.ItemName}, Quantity: ${selectedQuantity}`
      );
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catering Menu</h1>

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
          {/* Add more categories as needed */}
        </select>
      </div>

      {/* Catering Items Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">
              Price * quantity
            </th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={item.imagePath}
                  alt={item.ItemName}
                  className="h-16 w-16 object-cover rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.ItemName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.category}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.VariantDescription}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ${item.price}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  min="0"
                  value={quantities[item._id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(item._id, e.target.value)
                  }
                  className="border rounded px-2 py-1 w-20"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {/* Calculate total price: quantity * price */}$
                {quantities[item._id]
                  ? (quantities[item._id] * item.price).toFixed(2)
                  : "0.00"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleSave(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Save all selected items */}
      <div className="mt-4">
        <button
          onClick={handleSaveAll}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save All Selections
        </button>
      </div>
    </div>
  );
};

export default Catering;
