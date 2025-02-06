import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function Guest() {
  const { userId, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [totalYesPersons, setTotalYesPersons] = useState(0);
  const fetchYesPersonsCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/guests/count-yes?userID=${userId}`
      );
      setTotalYesPersons(response.data.totalPersons || 0);
    } catch (error) {
      console.error("Error fetching totalYesPersons:", error.message);
      toast.error("Failed to fetch Yes count.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchYesPersonsCount();
    }
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    guestName: "",
    numberOfPersons: "",
    phone: "",
    address: "",
    answerStatus: "",
    email: "",
  });

  const [guestList, setGuestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [guestsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState("All");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        userID: userId,
        guestName: formData.guestName,
        numberOfPersons: formData.numberOfPersons,
        phone: formData.phone,
        address: formData.address,
        answerStatus: formData.answerStatus,
        email: formData.email,
      };

      if (updatingGuestId) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/guests/${updatingGuestId}`,
          requestData
        );
        setGuestList(
          guestList.map((guest) =>
            guest._id === updatingGuestId ? response.data.updatedGuest : guest
          )
        );
        setUpdatingGuestId(null);
        toast.success("Guest updated successfully!");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/guests`,
          requestData
        );
        // setGuestList([...guestList, response.data.feature]);
        setGuestList((prevList) => {
          const updatedList = [...prevList, response.data.feature];
          // Navigate to the last page
          setCurrentPage(Math.ceil(updatedList.length / guestsPerPage));
          return updatedList;
        });
        toast.success("Guest created successfully!");
      }

      setFormData({
        guestName: "",
        numberOfPersons: "",
        phone: "",
        address: "",
        answerStatus: "",
        email: "",
      });

      fetchYesPersonsCount();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(
          error.response.data.message || "Validation error occurred."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error submitting form:", error.message);
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/guests?userID=${userId}`
      );
      setGuestList(response.data);
    } catch (error) {
      //console.error("Error fetching guests:", error.response.data.message);
      //toast.error("Failed to fetch guests.");
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const filteredGuests =
    filterStatus === "All"
      ? guestList
      : guestList.filter((guest) => guest.answerStatus === filterStatus);

  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );
  const [updatingGuestId, setUpdatingGuestId] = useState(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalYesGuests = guestList.filter(
    (guest) => guest.answerStatus === "Yes"
  ).length;
  const totalNOGuests = guestList.filter(
    (guest) => guest.answerStatus === "No"
  ).length;
  const totalNotyetGuests = guestList.filter(
    (guest) => guest.answerStatus === "Not yet"
  ).length;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/guests/${id}`);
      setGuestList(guestList.filter((guest) => guest._id !== id));
      toast.success("Guest deleted successfully!");
      fetchYesPersonsCount();
    } catch (error) {
      console.error("Error deleting guest:", error.message);
      toast.error("Failed to delete guest.");
    }
  };

  const handleUpdate = (id) => {
    const guestToUpdate = guestList.find((guest) => guest._id === id);
    if (guestToUpdate) {
      setFormData({
        guestName: guestToUpdate.guestName,
        numberOfPersons: guestToUpdate.numberOfPersons,
        phone: guestToUpdate.phone,
        address: guestToUpdate.address,
        answerStatus: guestToUpdate.answerStatus,
        email: guestToUpdate.email,
      });
      setUpdatingGuestId(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling animation
      });
    }
  };

  const handleSendInvitation = async (email) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/guests/send-invitation`,
        { userId, email }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(
        "Error sending invitation:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to send invitation.");
    }
  };

  const handleSendToAll = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/guests/send-to-all`,
        { userId }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(
        "Error sending to all:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to send emails to all.");
    }
  };

  const totalPages = Math.ceil(guestList.length / guestsPerPage);
  return (
    <div>
      <ToastContainer />
      <div className="relative min-h-screen bg-cover bg-center p-5 lg:p-14 bg-[url('https://i.postimg.cc/K8V29bgB/dance-of-guests.png')]">
        {/* Overlay for controlling opacity */}
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative mx-auto w-full lg:max-w-[calc(90%-200px)] max-w-full bg-opacity-90 shadow-md rounded-lg lg:space-y-4 space-y-2">
          {/*<div className="min-h-screen bg-BgCreme px-20 py-10">*/}
          {/*<div className="container mx-auto bg-BgGray shadow-md rounded-lg p-8 space-y-6">*/}
          <h2 className="text-lg lg:text-xl font-bold text-center text-BgFont mb-5">
            You can Add your Guest's List here and send them invitation Card by
            Email!
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:gap-4 gap-2">
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                placeholder="Guest Name"
                className="w-full px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
              <input
                type="number"
                name="numberOfPersons"
                value={formData.numberOfPersons}
                onChange={handleChange}
                placeholder="Number of Persons"
                className="w-full px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
                required
              />
            </div>
            <textarea
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address of Guests"
              className="w-full px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
              required
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center md:w-1/3 space-x-2">
                <label className="text-BgFont font-medium whitespace-nowrap">
                  Answer Status:
                </label>
                <select
                  name="answerStatus"
                  value={formData.answerStatus || ""}
                  onChange={handleChange}
                  className="custom-select px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark w-[calc(100%+20px)]"
                  required
                >
                  <option className="px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m">
                    select status{" "}
                  </option>
                  <option value="Not yet">Not yet</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full md:w-1/2 bg-BgPinkMiddle text-BgFont font-bold px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m rounded-lg hover:bg-BgPinkDark"
              >
                {updatingGuestId ? "Update Guest" : "Add Guest"}
              </button>
            </div>
          </form>
          <div>
            <hr />
            <br />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-6">
            <h3 className="px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m font-semibold text-BgFont">
              YES Answer: {totalYesGuests}
            </h3>
            <h3 className="px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m font-semibold text-BgFont">
              NO Answer: {totalNOGuests}
            </h3>
            <h3 className="px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m font-semibold text-BgFont">
              NOT YET Answer: {totalNotyetGuests}
            </h3>
            <h3 className="px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m font-semibold text-BgFont">
              Total GUESTS with YES Answer: {totalYesPersons}
            </h3>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-6">
            <div>
              <label htmlFor="filter">Filter by Answer Status: </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="custom-select px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m  border border-BgPinkDark rounded-lg focus:outline-none focus:ring focus:ring-BgPinkDark focus:border-BgPinkDark"
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not yet">Not yet</option>
              </select>
            </div>

            <button
              onClick={handleSendToAll}
              className="w-full md:w-1/2 bg-BgPinkMiddle text-BgFont font-bold px-2 py-2 lg:px-4 lg:py-2 text-sm lg:text-m rounded-lg hover:bg-BgPinkDark"
            >
              Send Email to all Guests Who Have Not Responded
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-m  border-BgFont text-BgFont bg-customBg rounded-lg">
              <thead>
                <tr className="bg-BgKhaki text-BgFont font-bold">
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">Guest Name</th>
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">Number</th>
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">Email</th>
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">
                    Address for card sending
                  </th>
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">Answer Status</th>
                  <th className="px-2 py-1 lg:px-4 lg:py-2 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentGuests.map((guest) => (
                  <tr
                    key={guest._id}
                    className="hover:bg-gray-50 transition duration-200 text-center"
                  >
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 ">
                      {guest.guestName}
                    </td>
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 ">
                      {guest.numberOfPersons}
                    </td>
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 ">
                      {guest.email}
                    </td>
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 ">
                      {guest.address}
                    </td>
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 ">
                      {guest.answerStatus}
                    </td>
                    <td className="border px-2 py-1 lg:px-4 lg:py-2 gap-2 flex justify-center items-center">
                      <button
                        onClick={() => handleUpdate(guest._id)}
                        className="bg-BgPinkMiddle text-BgFont px-3 py-1 rounded hover:bg-BgPinkDark"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(guest._id)}
                        className="bg-BgPinkMiddle text-BgFont px-3 py-1 rounded hover:bg-BgPinkDark"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleSendInvitation(guest.email)}
                        className="bg-BgPinkMiddle text-BgFont px-3 py-1 rounded hover:bg-BgPinkDark"
                      >
                        Invite
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => paginate(page + 1)}
                className={`px-4 py-2 ${
                  currentPage === page + 1 ? "bg-BgPinkMiddle" : "bg-BgPink"
                } text-BgFont font-bold rounded-md hover:bg-BgPinkDark`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guest;
