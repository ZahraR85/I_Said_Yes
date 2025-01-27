import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VenueBooking = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [venue, setVenue] = useState(null);
  const [images, setImages] = useState([]);
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingConflict, setBookingConflict] = useState(false);
  const toastShown = useRef(false); // Flag to track if toast has already been shown

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchWeddingDate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userinfoes/${userId}`
        );
        if (response.data?.weddingDate) {
          setDay(response.data.weddingDate.split("T")[0]); // Set formatted date (YYYY-MM-DD)
        } else {
          handleMissingUserInfo();
        }
      } catch (error) {
        // Only handle 404 errors for missing user information gracefully
        if (error.response?.status === 404) {
          handleMissingUserInfo();
        } else {
          console.error("Error fetching wedding date:", error); // Log other errors
          toast.error("An unexpected error occurred. Please try again later.");
        }
      }
    };

    const handleMissingUserInfo = () => {
      if (!toastShown.current) {
        // Ensure the toast is only shown once
        toast.warn(
          "User information not found. Please fill out the form on the User Information page before selecting a venue.",
          { position: "top-center", autoClose: 3000 }
        );
        toastShown.current = true; // Mark toast as shown
        setTimeout(() => navigate("/userInfo"), 3000); // Navigate after showing toast
      }
    };

    if (userId) {
      fetchWeddingDate();
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/venues/${venueId}`
        );
        setVenue(response.data);
        setImages(response.data.images || []);
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setError("Failed to fetch venue details.");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueDetails();
    }
  }, [venueId]);

  const checkBookingConflict = async (selectedDate) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/venueSelections/venue/${venueId}/date/${selectedDate}`
      );
      setBookingConflict(response.data.length > 0);
    } catch (error) {
      console.error("Error checking booking conflict:", error);
      setError("Failed to check booking availability.");
    }
  };

  useEffect(() => {
    if (day) {
      checkBookingConflict(day);
    }
  }, [day]);

  const googleMapsLink =
    venue && venue.latitude && venue.longitude
      ? `http://maps.google.com/maps?z=12&t=k&q=loc:${venue.latitude}+${venue.longitude}`
      : null;

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? venue.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === venue.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSubmit = async () => {
    if (bookingConflict) {
      toast.error(
        "This venue is already booked on the selected date. Please choose another date."
      );
      return;
    }

    try {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(day);
      if (!isValidDate) {
        toast.error("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }

      setLoading(true);

      // Send booking request to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/venueSelections`,
        {
          userId,
          date: day,
          venueId,
        }
      );

      toast.success(response.data.message); // Use the message from the backend

      // Add to shopping cart
      const shoppingCartData = {
        userID: userId,
        serviceName: "Venue",
        price: venue?.total,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shoppingcards`,
        shoppingCartData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      addToShoppingCard(shoppingCartData);
      toast.success("Venue booking successfully completed!");
      setTimeout(() => {
        navigate("/shoppingCard");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while processing the venue booking. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen bg-cover bg-center p-4 md:p-20 bg-BgPink">
      <ToastContainer />
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="relative mx-auto w-full max-w-full lg:max-w-[calc(100%-100px)] bg-customBg shadow-md rounded-lg p-4 md:p-5 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-BgFont">
          {venue?.name}
        </h1>
        <div className="relative">
          <img
            src={`${venue?.images[currentIndex]}`}
            alt={`Venue ${currentIndex}`}
            className="w-full h-auto object-cover rounded-md"
          />
          <div className="absolute top-1/2 left-0 right-0 flex justify-between">
            <button
              onClick={handlePrevImage}
              className="bg-white p-2 rounded-full shadow-md hover:bg-BgPinkDark"
            >
              Prev
            </button>
            <button
              onClick={handleNextImage}
              className="bg-white p-2 rounded-full shadow-md hover:bg-BgPinkDark"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex-1 my-4">
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              City: {venue?.city}
            </p>
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Capacity: {venue?.capacity}
            </p>
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Price: {venue?.price} €
            </p>
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Discount: {venue?.discount} %
            </p>
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Total price: {venue?.total} €
            </p>
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Description: {venue?.description}
            </p>
          </div>
          <div className="flex-1 my-4">
            <p className="text-sm md:text-base font-bold text-BgFont my-4">
              Address: {venue?.address}
            </p>

            <p className="text-sm md:text-base font-bold text-BgFont my-4 mr-4 inline-block">
              Location: {venue?.latitude}, {venue?.longitude}
            </p>
            <a
              className="bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark py-2 px-4 rounded mt-4 "
              target="_blank"
              rel="noopener noreferrer"
              href={googleMapsLink}
            >
              See it on Google Maps
            </a>
            <label className="text-sm md:text-base font-bold text-BgFont my-4 block">
              Weeding Date:
              <input
                type="date"
                value={day}
                readOnly
                className="w-full p-2 border rounded mb-4"
              />
            </label>
            {bookingConflict && (
              <p className="text-red-500 mt-2">
                This venue is already booked on the selected date. Please choose
                another date.
              </p>
            )}
            <button
              onClick={handleSubmit}
              className="w-full bg-BgPinkMiddle text-lg text-BgFont font-bold py-2 rounded hover:bg-BgPinkDark mb-2"
              disabled={loading || bookingConflict}
            >
              {loading ? "Booking..." : "Book Venue"}
            </button>
            <button
              onClick={() => navigate("/VenueSelections")}
              className="bg-BgPinkMiddle text-lg text-BgFont font-bold hover:bg-BgPinkDark py-2 px-4"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueBooking;
