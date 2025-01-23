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
    <div className="flex justify-center items-start pt-10 min-h-screen bg-[url('./images/cateringso2.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full p-4 sm:p-8 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <h2 className="text-2xl text-BgFont text-center font-bold mb-4">
          Edit Catering Item
        </h2>
        <form
          onSubmit={handleUpdateItem}
          className="space-y-4 bg-white text-BgFont p-6 rounded shadow-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={ItemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
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
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={VariantDescription}
              onChange={(e) => setVariantDescription(e.target.value)}
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
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
          <button
            type="submit"
            className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCateringItem;
