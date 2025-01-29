import { useState, useEffect } from "react";
import axios from "axios";

const UserSelections = ({ userId }) => {
  const [userSelections, setUserSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSelections = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/venueSelections/${userId}`
        );
        console.log("API Response:", response.data);
        setUserSelections(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response && err.response.status === 404) {
          setError({
            message:
              "It seems no Venue were selected. Please feel free to choose your preferences!",
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

  if (!userSelections.length) {
    return <p>No venues selected for this user.</p>;
  }

  const formatImagePath = (path) =>
    `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;

  return (
    <div>
      <div className="mx-auto  max-w-[calc((6)0%-130px)] bg-opacity-80 pace-y-4 p-4  ">
        <ul>
          {userSelections.map((selection) => (
            <li
              key={selection._id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="w-[180px] h-[180px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden flex justify-center items-center">
                {selection.venueId?.images?.[0] ? (
                  <img
                    src={selection.venueId.images[0]}
                    alt="Venue"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Ensures the image fills the circle
                    }}
                  />
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserSelections;
