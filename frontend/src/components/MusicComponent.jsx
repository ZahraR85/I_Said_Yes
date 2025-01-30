import { useState, useEffect } from "react";
import axios from "axios";

const UserSelections = ({ userId }) => {
  const [userSelections, setUserSelections] = useState(null); // State to store user data

  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchUserSelections = async () => {
      try {
        const x = userId;
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/musics?userID=${x}`
        );
        setUserSelections(response.data); // Update state with fetched data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response && err.response.status === 404) {
          setError({
            message:
              "It seems no Music features were selected. Please feel free to choose your preferences!",
            isCustom: true,
          });
        } else {
          setError({ message: err.message, isCustom: false });
        }
        setLoading(false);
      }
    };
    if (userId) fetchUserSelections();
  }, [userId]);

  // Handle errors
  if (error) {
    return <p>{error.isCustom ? error.message : `Error: ${error.message}`}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!userSelections || !userSelections.selections) {
    return <p>No data found for this user.</p>;
  }

  return (
    <div className="user-selections">
      <div className=" text-BgFont space-y-1 lg:space-y-4 p-1 lg:p-2">
        {userSelections.selections.map((item, idx) => (
          <div
            key={idx}
            className="mb-1 lg:mb-4 p-1 lg:p-2 bg-white rounded shadow"
          >
            <div className="flex items-center space-x-4">
              <p className="text-xs lg:text-base font-bold">
                {item.optionID?.name || "N/A"}
              </p>
              <p className="text-xxs lg:text-xs text-{#555}">
                ${item.optionID?.pricePerHour || 0} per Hour
              </p>
              <p className="text-xxs lg:text-xs text-{#555}">
                For {item.hours} Hours
              </p>
            </div>
            <p className="text-xxs lg:text-xs text-{#555}">
              Total: ${item.totalPrice}
            </p>
          </div>
        ))}
        <h6 className="mt-1 lg:mt-4 text-xxs lg:text-xs font-bold">
          Custom Requests:
        </h6>
        {userSelections.customRequests?.map((request, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-xs lg:text-m mb-2 lg:mb-4 text-BgFont">
              {request.description || "No description"}
            </p>
            {/* <p className="text-xxs lg:text-xs text-{#555}">
              {request.details || "No details"}
            </p> */}
          </div>
        )) || (
          <p className="text-xxs lg:text-xs mb-2 text-BgFont">
            No custom requests found.
          </p>
        )}
      </div>
      <p className="text-sm lg:text-lg font-bold mb-2 lg:mb-4 text-BgFont">
        Total Cost: ${userSelections.totalCost}
      </p>
      <p className="text-xxs lg:text-xs text-BgFont">
        Last Updated:{" "}
        {userSelections.updatedAt
          ? new Date(userSelections.updatedAt).toLocaleString()
          : "No Update Info"}
      </p>
    </div>
  );
};

export default UserSelections;
