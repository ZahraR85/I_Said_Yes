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
    <div className="flex justify-center items-start lg:pt-10 min-h-screen bg-[url('./images/cateringso2.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full text-center p-4 sm:p-8 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-BgFont text-xl lg:text-2xl font-bold mb-4">
            Add Catering Items
          </h2>
          <input
            type="text"
            placeholder="Item Name"
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <input
            type="file"
            onChange={(e) => setImagePath(e.target.files[0])}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <textarea
            placeholder="Description of Variant and ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-BgFont lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
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
          <button
            onClick={handleAddItem}
            className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
          >
            Submit
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-BgFont ">
          {categories.map((cat) => (
            <Link
              to={`/Admin/AdminCatering/category/${cat}`}
              key={cat}
              className="bg-white shadow-md p-4 rounded-lg border-4 border-BgPinkDark cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
            >
              <h3 className="text-xl text-BgFont font-bold mb-4">{cat}</h3>
              <p className="text-sm text-BgFont">
                See & Manage all <span className="font-bold">{cat}</span> items
                by clicking here
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCatering;
