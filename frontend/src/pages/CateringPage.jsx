import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CateringPage = () => {
  const [cateringItems, setCateringItems] = useState([]); // All catering items
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items based on category
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default category

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
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catering Menu</h1>
      {/* total prices for each Category*/}
      <div>
        <label htmlFor="category">SStarter:</label>
        <p id="category" className="bg-pink-50">
          total of each item per quantity
        </p>
      </div>
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

      {/* Catering Items Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <img
              src={item.imagePath}
              alt={item.ItemName}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{item.ItemName}</h2>
            <p className="text-gray-600">{item.category}</p>
            <p className="font-bold text-lg">${item.price}</p>

            {/* Link to item detail page */}
            <Link
              to={`/cateringPage/${item._id}`}
              className="mt-2 inline-block text-blue-500 hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CateringPage;
