/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const VenueForm = ({ venue, onCancel }) => {
  const { userId, isAuthenticated, role } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    capacity: "",
    price: "",
    discount: "",
    address: "",
    latitude: "",
    longitude: "",
    images: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page."); // Show warning toast
      setTimeout(() => {
        navigate("/signin"); // Delay navigation
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    if (venue) {
      setFormData({
        ...venue,
        latitude: venue.latitude || "",
        longitude: venue.longitude || "",
      });
      setExistingImages(venue.images || []);
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles([...newImageFiles, ...files]);
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    const removedImageUrl = existingImages[index];
    setExistingImages(updatedImages);
    setRemovedImages([...removedImages, removedImageUrl]); // Track the removed image URL
  };

  const removeNewImage = (index) => {
    const updatedNewImages = newImageFiles.filter((_, i) => i !== index);
    setNewImageFiles(updatedNewImages);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploadFormData = new FormData();

      // Append new image files
      newImageFiles.forEach((file) => {
        uploadFormData.append("images", file); // Appending the new images
      });

      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") uploadFormData.append(key, value); // Appending other form fields
      });

      // Send images to remove (ensure only one array of removed images)
      const imagesToRemove = [...removedImages];
      if (imagesToRemove.length > 0) {
        uploadFormData.append("removeImages", JSON.stringify(imagesToRemove));
      }

      uploadFormData.append("userId", userId);

      // Send POST/PUT request to add or update venue
      const url = venue
        ? `${import.meta.env.VITE_API_URL}/venues/${venue._id}` // Update the venue if it already exists
        : `${import.meta.env.VITE_API_URL}/venues`; // Create a new venue if no existing venue
      const method = venue ? "put" : "post"; // Choose PUT for update or POST for creation

      const response = await axios({
        method,
        url,
        data: uploadFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        response.data.message ||
          (venue ? "Venue updated successfully!" : "Venue added successfully!")
      );

      // Reset form after submission
      setFormData({
        name: "",
        city: "",
        capacity: "",
        price: "",
        discount: "",
        address: "",
        latitude: "",
        longitude: "",
        images: [],
        description: "",
      });

      setNewImageFiles([]);
      setRemovedImages([]);
      setExistingImages([]);
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.alert("Failed to add or update venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center p-5 lg:p-20 bg-customBg1 lg:bg-[url('https://i.postimg.cc/Kv1WnL9Q/photography.png')]">
      {/* Overlay for controlling opacity */}
      <ToastContainer />
      <div className="absolute inset-0 bg-white/50 "></div>
      <div className="relative mx-auto w-full max-w-[calc(100%-10px)] lg:max-w-[calc(60%-140px)] bg-opacity-80 shadow-md rounded-lg p-5 space-y-4">
        <h1 className="text-xl lg:text-3xl font-bold lg:m-5 m-2 text-center text-BgFont">
          {venue ? "Edit Venue" : "Add New Venue"}
        </h1>

        {/* Form fields */}
        <div className="flex">
          <div className="w-1/2 pr-8">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Venue Name"
              required
              className="input input-bordered w-full mb-2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="input input-bordered w-full mb-2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              required
              className="input input-bordered w-full text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
          </div>
          <div className="w-1/2">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="input input-bordered w-full mb-2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount (%)"
              className="input input-bordered w-full mb-2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <div className="flex gap-2 text-sm font-semibold text-BgFont lg:text-lg">
              Location:
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                required
                className="input input-bordered w-1/2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              />
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                required
                className="input input-bordered w-1/2 text-sm lg:text-lg border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              />
            </div>
          </div>
        </div>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded w-full lg:h-20 h-10 text-sm lg:text-lg border-BgPinkDark focus:outline-none focus:ring focus:ring-BgPinkDark"
          rows={5}
          placeholder="address"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full lg:h-20 h-10 text-sm lg:text-lg border-BgPinkDark focus:outline-none focus:ring focus:ring-BgPinkDark"
          rows={5}
          placeholder="Description"
        />

        {/* Existing Images */}
        <div>
          <h3 className="text-sm font-semibold text-BgFont lg:text-lg lg:font-bold mt-2">
            Existing Images
          </h3>
          <div className="flex flex-wrap gap-2">
            {existingImages.length > 0 ? (
              existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${img}`} // Make sure this is a valid image URL
                    alt="Venue"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-0 right-0 text-white text-sm lg:text-lg bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p className="text-BgFont text-sm lg:text-lg">
                No existing images found.
              </p>
            )}
          </div>

          {/* New Images */}
          <h3 className="text-sm font-semibold text-BgFont lg:text-lg lg:font-bold mt-2">
            New Images
          </h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border mx-2 p-2 text-sm lg:text-lg rounded w-full text-BgFont border-BgPinkDark focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <div className="flex flex-wrap gap-2 lg:mt-2 mt-1">
            {newImageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded "
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-0 right-0 text-sm lg:text-lg text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-row gap-4">
          <button
            onClick={handleSubmit}
            className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
          >
            {venue ? "Update Venue" : "Add Venue"}
          </button>
          {venue && (
            <button
              onClick={onCancel}
              className="bg-BgPinkMiddle text-BgFont text-sm lg:text-lg font-bold hover:bg-BgPinkDark lg:hover:text-xl hover:text-lg w-full lg:p-4 p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueForm;
