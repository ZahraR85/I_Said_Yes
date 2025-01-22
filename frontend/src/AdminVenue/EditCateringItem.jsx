import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCateringItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ItemName, setItemName] = useState("");
  const [VariantDescription, setVariantDescription] = useState("");
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
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/caterings/${id}`
        );
        const data = response.data;
        setItem(data);
        setItemName(data.ItemName);
        setVariantDescription(data.VariantDescription);
        setPrice(data.price);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("Failed to fetch item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
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
      formData.append("ItemName", ItemName);
      if (imagePath) formData.append("image", imagePath);
      else formData.append("keepExistingImage", true);
      formData.append("VariantDescription", VariantDescription);
      formData.append("price", price);
      formData.append("category", category);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/caterings/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Catering item updated successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Edit Catering Item</h2>
      <form
        onSubmit={handleUpdateItem}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={VariantDescription}
            onChange={(e) => setVariantDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Starter">Starter</option>
            <option value="MainCourse">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="ColdDrink">Cold Drink</option>
            <option value="CafeBar">Cafe Bar</option>
            <option value="Fruits">Fruits</option>
            <option value="Cake">Cake</option>
            <option value="Waiter">Waiter</option>
          </select>
        </div>
        {item?.image && (
          <div className="mt-4">
            <p>Current Image:</p>
            <img
              src={`${import.meta.env.VITE_API_URL}/${item.image}`}
              alt={ItemName}
              className="h-20 mt-2 border"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">New Image</label>
          <input
            type="file"
            onChange={(e) => setImagePath(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditCateringItem;
