import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoryItems = () => {
  const { category } = useParams();
  const navigate = useNavigate(); // Hook to navigate between pages
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const normalizedCategory = category.toLowerCase();
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/caterings/category/${normalizedCategory}`
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [category]);

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/caterings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh items after deletion
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-lg lg:text-2xl font-bold mb-4 capitalize">
        Items in {category}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white text-center shadow-md rounded-lg border-2 border-BgPinkDark cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
          >
            <img
              src={item.imagePath}
              alt={item.ItemName}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <div className="p-4">
              <h3 className="text-m lg:text-lg text-BgFont font-semibold">
                {item.ItemName}
              </h3>
              <p>{item.description}</p>
              <p className="text-lg text-red-500 font-bold">${item.price}</p>
              <button
                onClick={() =>
                  navigate(`/Admin/AdminCatering/edit/${item._id}`)
                }
                className="mt-2 lg:mt-4 ml-2 lg:px-4 px-2 lg:py-2 py-1 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="mt-2 lg:mt-4 ml-2 lg:px-4 px-2 lg:py-2 py-1 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p>No items found in this category.</p>}
      </div>
    </div>
  );
};

export default CategoryItems;
