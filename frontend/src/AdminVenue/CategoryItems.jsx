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
      <h2 className="text-2xl font-bold mb-4 capitalize">
        Items in {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg p-4 text-center"
          >
            <img
              src={item.imagePath}
              alt={item.ItemName}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-semibold">{item.ItemName}</h3>
            <p>{item.description}</p>
            <p className="text-green-500 font-bold">${item.price}</p>
            <button
              onClick={() => navigate(`/Admin/AdminCatering/edit/${item._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteItem(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
        {items.length === 0 && <p>No items found in this category.</p>}
      </div>
    </div>
  );
};

export default CategoryItems;
