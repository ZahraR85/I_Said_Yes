import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use predefined categories
const categories = ["Flowers", "Decoration", "Lighting", "Sound", "Fireworks"];

const EditDesignItem = () => {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    imagePath: null,
  });
  const { userId, isAuthenticated, role } = useAppContext();
  const navigate = useNavigate();

  // Ensure the user is an authenticated admin
  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch the design item by ID
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/designs/${id}`
        );
        setDesign(response.data);
        setFormData(response.data); // Pre-fill form with fetched data
      } catch (error) {
        console.error("Error fetching design:", error);
      }
    };
    fetchDesign();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      imagePath: e.target.files[0], // Handle file input
    }));
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      // Use FormData for file upload
      const updateData = new FormData();
      updateData.append("itemName", formData.itemName);
      updateData.append("description", formData.description);
      updateData.append("price", formData.price);
      updateData.append("category", formData.category);
      updateData.append("userId", userId); // Ensure userId is sent
      updateData.append(
        "keepExistingImage",
        formData.imagePath ? "false" : "true"
      );

      // Append image file if a new one is selected
      if (formData.imagePath) {
        updateData.append("image", formData.imagePath);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/designs/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Design item updated successfully.");
      navigate(-1); // Navigate back after successful update
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  if (!design) return <div>Loading...</div>;

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
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
          </div>

          <div className="mt-4">
            <input type="file" name="imagePath" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-BgPinkDark rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
