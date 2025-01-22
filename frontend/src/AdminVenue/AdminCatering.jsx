import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const AdminCatering = () => {
  const [allItems, setAllItems] = useState([]); // All catering items
  const [ItemName, setItemName] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const { userId, isAuthenticated, role } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/caterings`
      );
      setAllItems(response.data);
    } catch (error) {
      console.error("Error fetching catering items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        throw new Error("No token found in localStorage");
      }

      if (!userId || !ItemName || !category || !imagePath) {
        alert(
          "User ID, ItemName, category, and image are required to add an item"
        );
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("ItemName", ItemName);
      formData.append("image", imagePath);
      formData.append("VariantDescription", description);
      formData.append("price", price);
      formData.append("category", category);

      await axios.post(`${import.meta.env.VITE_API_URL}/caterings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Catering item added successfully");
      fetchItems();
      setItemName("");
      setImagePath(null);
      setDescription("");
      setPrice("");
      setCategory("");
    } catch (error) {
      console.error("Error adding catering item:", error);
      toast.error("Failed to add item");
    }
  };

  /*const handleUpdateItem = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      if (!ItemName || !category) {
        alert("ItemName and category are required to update an item");
        return;
      }

      const formData = new FormData();
      formData.append("ItemName", ItemName);
      formData.append("image", imagePath);
      formData.append("VariantDescription", description);
      formData.append("price", price);
      formData.append("category", category);

      if (imagePath) {
        formData.append("image", imagePath);
      } else {
        formData.append("keepExistingImage", true);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/caterings/${editingItemId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Catering item updated successfully");
      fetchItems();
      setItemName("");
      setImagePath(null);
      setDescription("");
      setPrice("");
      setCategory("");
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating catering item:", error);
      toast.error("Failed to update item");
    }
  };
*/
  const handleEditFromCategory = (item) => {
    setEditingItemId(item._id); // Set the item being edited
    setItemName(item.ItemName);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImagePath(null); // Reset the image input
  };

  const categories = [
    "Starter",
    "MainCourse",
    "Dessert",
    "ColdDrink",
    "CafeBar",
    "Fruits",
    "Cake",
    "Waiter",
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Add / Edit Catering Items</h2>
          <input
            type="text"
            placeholder="Item Name"
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="file"
            onChange={(e) => setImagePath(e.target.files[0])}
            className="w-full mb-4 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {editingItemId ? (
            <button
              onClick={handleEditFromCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Item
            </button>
          ) : (
            <button
              onClick={handleAddItem}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              to={`/Admin/AdminCatering/category/${cat}`} // No toLowerCase()
              key={cat}
              className="block bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">{cat}</h3>
              <p>Manage all {cat} items</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCatering;
