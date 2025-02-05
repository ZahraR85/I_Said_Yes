import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const CategoryItemsDesign = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const IMAGES_PER_PAGE = 15;

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch items for the selected category
  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const normalizedCategory = category.toLowerCase();
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/designs/category/${normalizedCategory}`
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

      await axios.delete(`${import.meta.env.VITE_API_URL}/designs/${id}`, {
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

  // Pagination logic
  const totalPages = Math.ceil(items.length / IMAGES_PER_PAGE);
  const currentItems = items.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-lg lg:text-2xl font-bold mb-4 text-BgFont capitalize">
        Items in {category}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {currentItems.map((item) => (
          <div
            key={item._id}
            className="bg-white text-center shadow-md rounded-lg border-2 border-BgPinkDark cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
          >
            <img
              src={item.imagePath}
              alt={item.itemName}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <div className="p-4">
              <h3 className="text-m lg:text-lg text-BgFont font-semibold">
                {item.itemName}
              </h3>
              <p className="text-lg text-red-500 font-bold">${item.price}</p>
              <button
                onClick={() => navigate(`/Admin/AdminDesign/edit/${item._id}`)}
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
        {currentItems.length === 0 && <p>No items found in this category.</p>}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-BgPinkMiddle hover:bg-BgPinkDark text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-BgFont font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-BgPinkMiddle hover:bg-BgPinkDark text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryItemsDesign;
