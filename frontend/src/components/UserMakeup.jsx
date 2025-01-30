import { useState, useEffect } from "react";
import axios from "axios";

const UserSelections = ({ userId }) => {
  const [userSelections, setUserSelections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSelections = async () => {
      try {
        const x = userId;
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/makeups?userID=${x}`
        );

        setUserSelections(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response && err.response.status === 404) {
          setError({
            message:
              "It seems no Makeup features were selected. Please feel free to choose your preferences!",
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

  if (error) {
    return <p>{error.isCustom ? error.message : `Error: ${error.message}`}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!userSelections) {
    return <p>No data found for this user.</p>;
  }

  // Render user selections
  return (
    <div className="user-selections">
      <div className="mx-auto text-BgFont space-y-2 lg:space-y-4 p-1 lg:p-4">
        <ul className="space-y-1 lg:space-y-4">
          <li>
            {userSelections.makeup?.selected ? "✔️" : "❌"}
            Makeup{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.makeup?.price || 0})
            </span>
          </li>
          <li>
            {userSelections.dress?.selected ? "✔️" : "❌"}
            Dress{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.dress?.price || 0})
            </span>
          </li>
          <li>
            {userSelections.nail?.selected ? "✔️" : "❌"}
            Nail{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.nail?.price || 0})
            </span>
          </li>
          <li>
            {userSelections.hairstyle?.selected ? "✔️" : "❌"}
            Hairstyle{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.hairstyle?.price || 0})
            </span>
          </li>
          <li>
            {userSelections.shoes?.selected ? "✔️" : "❌"}
            Shoes{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.shoes?.price || 0})
            </span>
          </li>
          <li>
            {userSelections.special?.selected ? "✔️" : "❌"}
            Special{" "}
            <span className="text-xs text-BgFont font-semibold">
              {" "}
              (${userSelections.special?.price || 0})
            </span>
          </li>
        </ul>
        <br />
        <br />

        <p className="text-xs lg:text-lg text-BgFont font-bold">
          Total Cost: ${userSelections.total || 0}
        </p>
        <p className="mt-4 text-xxs lg:text-xs text-BgFont">
          Last Updated:{" "}
          {userSelections.updatedAt
            ? new Date(userSelections.updatedAt).toLocaleString()
            : "No Update Info"}
        </p>
      </div>
    </div>
  );
};

export default UserSelections;
