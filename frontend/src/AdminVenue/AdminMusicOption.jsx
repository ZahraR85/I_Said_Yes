/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

// MusicOptionsPage component
const MusicOptionsPage = () => {
  const { userId, isAuthenticated, role } = useAppContext();
  const navigate = useNavigate(); // Navigation hook
  const [musicOptions, setMusicOptions] = useState([]);
  const [newOption, setNewOption] = useState({
    category: "",
    name: "",
    pricePerHour: "",
    description: "",
    additionalFeatures: [],
    sampleLink: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Function to fetch music options
  const fetchMusicOptions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/musicoptions`
      );
      setMusicOptions(response.data);
    } catch (error) {
      console.error("Error fetching music options", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch the music options when the component is mounted
  useEffect(() => {
    if (userId) {
      fetchMusicOptions();
    }
  }, [userId]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOption((prevOption) => ({
      ...prevOption,
      [name]: value,
    }));
  };

  // Handle adding a new music option
  const handleAddOption = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/musicoptions`,
        newOption
      );
      setNewOption({
        category: "",
        name: "",
        pricePerHour: "",
        description: "",
        additionalFeatures: [],
        sampleLink: "",
      });
      toast.success("MusicOption added successfully");
      fetchMusicOptions(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding music option", error);
      toast.alert("Failed to add MusicOption");
    }
  };

  // Handle editing a music option
  const handleEditOption = async (id) => {
    const optionToEdit = musicOptions.find((option) => option._id === id);
    setNewOption(optionToEdit);
    setIsEditing(true);
    setEditingId(id);
  };

  // Handle updating a music option
  const handleUpdateOption = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/musicoptions/${editingId}`,
        newOption
      );
      setIsEditing(false);
      setEditingId(null);
      setNewOption({
        category: "",
        name: "",
        pricePerHour: "",
        description: "",
        additionalFeatures: [],
        sampleLink: "",
      });
      toast.success("Music option updated successfully");
      fetchMusicOptions(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating music option", error);
      toast.alert("Failed to update Music option");
    }
  };

  // Handle deleting a music option
  const handleDeleteOption = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/musicoptions/${id}`);
      toast.success("Music option deleted successfully");
      fetchMusicOptions(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting music option", error);
      toast.alert("Failed to delete Music option");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      {/* Background Section */}
      <div className="relative min-h-screen bg-cover bg-center p-20 bg-[url('https://i.postimg.cc/fytpMk46/music.png')]">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative mx-auto w-full max-w-[calc(85%-100px)] lg:max-w-[calc(60%-100px)] bg-opacity-80 shadow-md rounded-lg p-10 mt-10 space-y-4">
          <h2 className="text-lg lg:text-2xl font-bold text-BgFont mb-5 lg:mb-12 text-center">
            Add / Edit Music Options
          </h2>
          <form
            className="space-y-2 lg:space-y-4"
            onSubmit={isEditing ? handleUpdateOption : handleAddOption}
          >
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={newOption.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newOption.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
            <input
              type="number"
              placeholder="Price per Hour"
              name="pricePerHour"
              value={newOption.pricePerHour}
              onChange={handleInputChange}
              className="w-full p-2 border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
              required
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={newOption.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <input
              type="text"
              placeholder="Sample Link"
              name="sampleLink"
              value={newOption.sampleLink}
              onChange={handleInputChange}
              className="w-full p-2 border border-BgPinkDark rounded focus:outline-none focus:ring focus:ring-BgPinkDark"
            />
            <button
              type="submit"
              className="w-full bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark hover:text-xl p-2 lg:p-4 rounded"
            >
              {isEditing ? "Update Option" : "Add Option"}
            </button>
          </form>
        </div>
      </div>

      {/* Music Options List Section */}
      <div className="w-full p-6 bg-customBg1 shadow-lg rounded-lg space-y-5">
        <h2 className="text-2xl text-BgFont font-bold mb-4">
          Available Music Options
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {musicOptions.map((option) => (
            <li
              key={option._id}
              className="bg-white shadow-md rounded-lg border-4 border-BgPinkDark hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out"
            >
              <div className="p-4">
                <h3 className="font-bold text-lg text-BgFont">{option.name}</h3>
                <p className="text-BgFont font-semibold">
                  Category: {option.category}
                </p>
                <p className="text-BgFont font-bold">
                  Price per Hour:{" "}
                  <span className="text-red-500 font-bold">
                    {" "}
                    {option.pricePerHour} €
                  </span>
                </p>
                <p className="text-BgFont text-sm">{option.description}</p>
              </div>
              <div className="mt-4 p-4">
                <button
                  onClick={() => handleEditOption(option._id)}
                  className="bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark hover:text-xl px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOption(option._id)}
                  className="bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark hover:text-xl px-4 py-2 rounded mr-2"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default MusicOptionsPage;
