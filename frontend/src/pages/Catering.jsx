import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CateringPage = () => {
  const [cateringItems, setCateringItems] = useState([]); // All catering items
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items based on category
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default category
  const [quantities, setQuantities] = useState({}); // Quantity for each item

  const navigate = useNavigate();
  // Fetch all catering items
  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings`
        ); // Replace with your actual API endpoint
        const data = await response.json();
        setCateringItems(data);
        setFilteredItems(data);
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
    if (category === "All") {
      setFilteredItems(cateringItems);
    } else {
      const filtered = cateringItems.filter(
        (item) => item.category === category
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
    console.log(`Saved item: ${item.name}, Quantity: ${selectedQuantity}`);
    // You can add the logic to save the selected item to the shopping cart or server here
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
          <option value="main">Main Course</option>
          <option value="dessert">Dessert</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      {/* Catering Items Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">category</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
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
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save All Selections
        </button>
      </div>
    </div>
  );
};

export default CateringPage;
