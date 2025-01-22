import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCatering = () => {
  const [formData, setFormData] = useState({
    category: "",
    ItemName: "",
    price: "",
    VariantDescription: "",
    additionalFeatures: [],
    sampleLink: "",
  });

  const [cateringItems, setCateringItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch catering items
  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/caterings`
        );
        setCateringItems(response.data);
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };

    fetchCateringItems();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/caterings/${editingId}`
        : `${import.meta.env.VITE_API_URL}/caterings`;
      const method = isEditMode ? "put" : "post";
      const response = await axios[method](url, formData);

      toast.success(
        `Catering item ${isEditMode ? "updated" : "added"} successfully!`
      );

      if (isEditMode) {
        setCateringItems((prev) =>
          prev.map((item) =>
            item._id === editingId ? response.data.updatedItem : item
          )
        );
      } else {
        setCateringItems((prev) => [...prev, response.data.cateringItem]);
      }

      setFormData({
        category: "",
        ItemName: "",
        price: "",
        VariantDescription: "",
        additionalFeatures: [],
        sampleLink: "",
      });
      setIsEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving catering item:", error);
      toast.error("Failed to save catering item!");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData(item);
    setIsEditMode(true);
    setEditingId(item._id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/caterings/${id}`);
      setCateringItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Catering item deleted successfully!");
    } catch (error) {
      console.error("Error deleting catering item:", error);
      toast.error("Failed to delete catering item!");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Manage Catering Items</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block font-bold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select a category</option>
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
        <div className="mb-4">
          <label className="block font-bold mb-2">Item Name</label>
          <input
            type="text"
            name="ItemName"
            value={formData.ItemName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Price (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Variant Description</label>
          <textarea
            name="VariantDescription"
            value={formData.VariantDescription}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Sample Link</label>
          <input
            type="url"
            name="sampleLink"
            value={formData.sampleLink}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isEditMode ? "Update" : "Add"}
        </button>
      </form>

      {/* Catering Items List */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Price (€)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cateringItems.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">{item.ItemName}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCatering;
