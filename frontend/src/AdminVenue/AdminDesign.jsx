import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

// Define the categories available for designs
const categories = ["Flowers", "Decoration", "Lighting", "Sound", "Fireworks"];

const AdminDesign = () => {
  const [allItems, setAllItems] = useState([]); // All catering items
  const [itemName, setItemName] = useState("");
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

  // Fetch designs on component mount
  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/designs`
      );
      setAllItems(response.data);
    } catch (err) {
      console.error("Error fetching designs items:", err);
    }
  };
  useEffect(() => {
    fetchDesigns();
  }, []);

  // Add a new design
  const handleAddDesign = async (e) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        throw new Error("No token found in localStorage");
      }

      if (!userId || !itemName || !category || !imagePath) {
        alert(
          "User ID, ItemName, category, and image are required to add an item"
        );
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("itemName", itemName);
      formData.append("image", imagePath);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      await axios.post(`${import.meta.env.VITE_API_URL}/designs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Designing item added successfully");
      fetchDesigns();
      setItemName("");
      setImagePath(null);
      setDescription("");
      setPrice("");
      setCategory("");
    } catch (error) {
      console.error("Error adding Designing item:", error);
      toast.error("Failed to add item");
    }
  };

  //Bridal bouquets, boutonnieres, centerpieces, altar arrangements, ceremony arches, and floral installations.
  return (
    <div className="flex justify-center items-start pt-10 min-h-screen bg-[url('./images/cateringso2.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full text-center p-4 sm:p-8 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-BgFont text-2xl font-bold mb-4">
            Add Designing Items
          </h2>
          <div>
            <form onSubmit={handleAddDesign} style={{ marginBottom: "40px" }}>
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
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
                type="submit"
                className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
              >
                Add Design
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-BgFont ">
            {categories.map((cat) => (
              <Link
                to={`/Admin/AdminDesign/category/${cat}`}
                key={cat}
                className="bg-white shadow-md p-4 rounded-lg border-4 border-BgPinkDark cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
              >
                <h3 className="text-xl text-BgFont font-bold mb-4">{cat}</h3>
                <p className="text-sm text-BgFont">
                  See & Manage all <span className="font-bold">{cat}</span>{" "}
                  items by clicking here
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDesign;
