import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const GalleryManagement = () => {
  const [allImages, setAllImages] = useState([]); // Store all fetched images
  const [currentPage, setCurrentPage] = useState(1);
  const IMAGES_PER_PAGE = 15;

  const [imageName, setImageName] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingImageId, setEditingImageId] = useState(null);
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

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/galleries`
      );
      //console.log('Fetched images:', response.data);
      setAllImages(response.data); // Update the state with the fetched images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const currentImages = allImages.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        throw new Error("No token found in localStorage");
      }

      if (!userId || !category || !imagePath) {
        alert("User ID, category, and image are required to add an image");
        return;
      }

      const formData = new FormData();
      formData.append("imageName", imageName);
      formData.append("image", imagePath); // Ensure `imagePath` is a file object from an input
      formData.append("description", description);
      formData.append("category", category);
      formData.append("userId", userId);

      await axios.post(`${import.meta.env.VITE_API_URL}/galleries`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Image added successfully");
      fetchImages();
      setImageName("");
      setImagePath(null);
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error("Error adding image:", error);
      toast.alert("Failed to add image");
    }
  };

  const handleUpdateImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      if (!userId || !category) {
        alert("User ID and category are required to update an image");
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("imageName", imageName);
      formData.append("description", description);
      formData.append("category", category);

      if (imagePath) {
        formData.append("image", imagePath);
      } else {
        formData.append("keepExistingImage", true); // Tell backend to keep the current image
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/galleries/${editingImageId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Image updated successfully");
      fetchImages(); // Reload images after updating
      setImageName("");
      setImagePath(null);
      setDescription("");
      setCategory("");
      setEditingImageId(null); // Clear editing state
    } catch (error) {
      console.error("Error updating image:", error);
      toast.alert("Failed to update image");
    }
  };

  const handleDeleteImage = async (id) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this item?</p>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              await axios.delete(
                `${import.meta.env.VITE_API_URL}/galleries/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              fetchImages(); // Reload images after deleting
              toast.success("Image deleted successfully");
            } catch (error) {
              console.error("Error deleting image:", error);
              toast.alert("Failed to delete image");
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          Yes, Delete
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const handleEditClick = (image) => {
    setEditingImageId(image._id);
    setImageName(image.imageName);
    setDescription(image.description);
    setCategory(image.category);
    setImagePath(null); // Clear file input on edit
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="relative min-h-screen bg-cover bg-center p-20 bg-[url('https://i.postimg.cc/qMRwT2zF/gallery3.jpg')]">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative mx-auto w-full max-w-[calc(85%-100px)] lg:max-w-[calc(45%-100px)] bg-opacity-80 shadow-md rounded-lg p-5 lg:mt-40 mt-28 space-y-4">
          <h2 className="lg:text-2xl text-m font-bold text-BgFont mb-1 lg:mb-12 text-center">
            Add / Edit Images in Gallery
          </h2>
          <input
            type="text"
            placeholder="Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              //console.log(file);
              setImagePath(file); // Set the selected file to state
            }}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <textarea
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full lg:mb-4 mb-2 lg:p-2 p-1 text-sm lg:text-m border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
          >
            <option value="" disabled>
              Select a Category
            </option>
            <option value="Venue">Venue</option>
            <option value="Makeup">Makeup</option>
            <option value="Photography">Photography</option>
            <option value="Wedding-dress">Wedding-dress</option>
            <option value="Musician">Musician</option>
            <option value="Cake">Cake</option>
          </select>
          {editingImageId ? (
            <button
              onClick={handleUpdateImage}
              className="w-full bg-BgPinkMiddle text-BgFont text-sm lg:text-m font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg lg:p-4 p-2 rounded"
            >
              Update Image
            </button>
          ) : (
            <button
              onClick={handleAddImage}
              className="w-full bg-BgPinkMiddle text-BgFont text-sm lg:text-m font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg lg:p-4 p-2 rounded"
            >
              Add Image
            </button>
          )}
        </div>
      </div>
      <div className="w-full p-6 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {currentImages.map((image) => (
            <div
              key={image._id}
              className="bg-white shadow-md rounded-lg border-4 border-BgPinkDark cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
            >
              <img
                src={`${image.imagePath}`}
                alt={image.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 lg:p-4">
                <p className="text-BgFont font-bold lg:text-lg text-m">
                  {image.imageName}
                </p>
                <p className="text-BgFont lg:text-lg text-sm">
                  {image.description}
                </p>
                <button
                  onClick={() => handleEditClick(image)}
                  className="mt-2 lg:mt-4 ml-2 lg:px-4 px-2 lg:py-2 py-1 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="mt-2 lg:mt-4 ml-2 lg:px-4 px-2 lg:py-2 py-1 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default GalleryManagement;
