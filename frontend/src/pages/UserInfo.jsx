import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const UserInfoForm = () => {
  const { userId, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    story: "",
    brideBirthday: "",
    groomBirthday: "",
    feedback: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } else {
      checkExistingForm();
    }
  }, [isAuthenticated, navigate]);

  // Check if the user already filled out the form
  // const response = await axios.get('http://localhost:3001/userinfoes');
  const checkExistingForm = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/userinfoes`
      );
      const existingData = response.data.find(
        (entry) => entry.userID === userId
      );

      if (existingData) {
        // Format date fields before setting form data
        setFormData({
          ...existingData,
          weddingDate: existingData.weddingDate
            ? existingData.weddingDate.split("T")[0]
            : "",
          brideBirthday: existingData.brideBirthday
            ? existingData.brideBirthday.split("T")[0]
            : "",
          groomBirthday: existingData.groomBirthday
            ? existingData.groomBirthday.split("T")[0]
            : "",
        });
        setIsUpdating(true);
        // alert("Form already exists. Ready to update.");
        toast.info("Form already exists. Ready to update.");
      }
    } catch (error) {
      console.error("Error checking existing form:", error);
      toast.error("Error fetching existing data.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData, userID: userId };

      if (isUpdating) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/userinfoes/${formData._id}`,
          payload
        );
        toast.success("Form updated successfully.");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/userinfoes`, payload);
        toast.success("Form created successfully.");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative min-h-screen bg-cover bg-center pt-20 p-5 bg-[url('https://i.postimg.cc/sg98vGsB/Screenshot-2024-12-30-171841.png')]">
        <h2 className="text-xl lg:text-2xl font-bold text-center text-BgFont ">
          {isUpdating
            ? "Please Update Your Information here!"
            : "Please Create Your Information here!"}
        </h2>
        <br /> <br />
        <form onSubmit={handleSubmit}>
          {/* Two-column inputs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Bride Name:
              </label>
              <input
                type="text"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                placeholder="Bride Name"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-lg border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
            </div>

            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Groom Name:
              </label>
              <input
                type="text"
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                placeholder="Groom Name"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-lg border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
            </div>

            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Wedding Date:
              </label>
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                placeholder="Wedding Date"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-lg border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
            </div>

            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Bride Birthday:
              </label>
              <input
                type="date"
                name="brideBirthday"
                value={formData.brideBirthday}
                onChange={handleChange}
                placeholder="Bride Birthday"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-lg border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
              />
            </div>

            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Groom Birthday:
              </label>
              <input
                type="date"
                name="groomBirthday"
                value={formData.groomBirthday}
                onChange={handleChange}
                placeholder="Groom Birthday"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-lg border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
              />
            </div>
          </div>
          <br /> <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Story:
              </label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                placeholder="Our story"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-m border border-BgPinkDark rounded hover:border-BgPinkDark hover:border-2 focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                rows="8"
              ></textarea>
            </div>

            <div>
              <label className="text-sm lg:text-lg font-bold text-center text-BgFont ">
                Feedback:
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Feedback"
                className="w-full px-4 lg:py-2 py-1 text-sm lg:text-m border border-BgPinkDark rounded hover:border-BgPinkDark hover:border-2 focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                rows="8"
              ></textarea>
            </div>
          </div>
          <br /> <br />
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 text-m lg:text-xl bg-BgPinkMiddle text-BgFont font-bold p-2 lg:py-4 lg:px-4 rounded-lg hover:bg-BgPinkDark"
            >
              {isUpdating ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoForm;
