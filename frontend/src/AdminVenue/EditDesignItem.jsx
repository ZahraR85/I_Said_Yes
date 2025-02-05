import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the categories available for designs
const categories = ["Flowers", "Decoration", "Lighting", "Sound", "Fireworks"];

const EditDesignItem = () => {
  const { id } = useParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imagePath, setImagePath] = useState(null);
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

  useEffect(() => {
    const fetchDesignItem = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/designs/${id}`
        );
        const data = response.data;
        setAllItems(data);
        setItemName(data.ItemName);
        setDescription(data.VariantDescription);
        setPrice(data.price);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("Failed to fetch item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesignItem();
  }, [id]);

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("itemName", itemName);
      if (imagePath) formData.append("image", imagePath);
      else formData.append("keepExistingImage", true);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/designs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Designing item updated successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-start pt-10 min-h-screen bg-[url('./images/cateringso2.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full p-4 sm:p-8 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <h2 className="text-2xl text-BgFont text-center font-bold mb-4">
          Edit Designing Item
        </h2>
        <form
          onSubmit={handleUpdateItem}
          className="space-y-4 bg-white text-BgFont p-6 rounded shadow-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
          </div>
          {allItems?.image && (
            <div className="mt-4">
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_API_URL}/${allItems.image}`}
                alt={itemName}
                className="h-20 mt-2 border"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">New Image</label>
            <input
              type="file"
              onChange={(e) => setImagePath(e.target.files[0])}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-BgFont lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
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
          </div>
          <button
            type="submit"
            className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDesignItem;
