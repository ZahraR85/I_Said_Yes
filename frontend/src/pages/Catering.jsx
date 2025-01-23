import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CateringItemsPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings/categories`
        );
        const data = await response.json();
        setCategories(["All", ...data]); // "All" will be the default option
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch all catering items
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings/`
        );
        const data = await response.json();
        setItems(data);
        setFilteredItems(data); // Initially show all items
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };

    fetchCategories();
    fetchItems();
  }, []);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Filter items based on selected category
    if (category === "All") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.category === category);
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

  // Handle save (store selected items and their quantities)
  const handleSave = () => {
    // For now, just log the quantities
    console.log("Selected items with quantities:", quantities);
    // You can add code here to save or send the selected items to the backend or user session
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catering Items</h1>

      {/* Category Selection */}
      <div className="mb-4">
        <label htmlFor="category" className="mr-2">
          Select Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Catering Items Table */}
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">
                <img
                  src={item.imagePath} // Assuming imagePath contains the URL
                  alt={item.ItemName}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="border px-4 py-2">{item.ItemName}</td>
              <td className="border px-4 py-2">${item.price}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="0"
                  value={quantities[item._id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(item._id, e.target.value)
                  }
                  className="p-2 border"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    // Save functionality (could be saved to local state or backend)
                    console.log("Item saved:", item.ItemName);
                  }}
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
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save All Selections
        </button>
      </div>
    </div>
  );
};

export default CateringItemsPage;
