import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const UserSelections = () => {
  const { userId } = useAppContext();
  const [userSelections, setUserSelections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSelections = async () => {
      try {
        if (!userId) {
          throw new Error("User ID is missing");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cateringusers/${userId}`
        );
        setUserSelections(response.data);
      } catch (err) {
        console.error("Error fetching user selections:", err);
        if (err.response && err.response.status === 404) {
          setError({
            message:
              "It seems no Catering features were selected. Please feel free to choose your preferences!",
            isCustom: true,
          });
        } else {
          setError({ message: err.message, isCustom: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserSelections();
  }, [userId]);

  // Handle errors
  if (error) {
    return <p>{error.isCustom ? error.message : `Error: ${error.message}`}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userSelections) {
    return <p>No data available for this user.</p>;
  }

  // Process the items array from the schema
  // Here we expect the `cateringItemId` to be populated with the Catering document
  const items = userSelections.items.map((item) => ({
    // Use ItemName from the populated Catering document
    name: item.cateringItemId?.ItemName || "Item",
    quantity: item.quantity,
    price: item.price,
    total: item.totalPrice,
  }));

  if (items.length === 0) {
    return <p>No items selected for this user.</p>;
  }

  return (
    <div className="user-selections mx-auto max-w-xl text-BgFont space-y-2 p-1">
      <div className="space-y-1 lg:space-y-2">
        {items.map((item, index) => (
          <div key={index} className="text-xs font-bold">
            {item.quantity > 0 ? (
              <>
                ✔ {item.name}:{" "}
                <span className="text-xs text-BgFont font-semibold">
                  ${item.price} x {item.quantity}{" "}
                  <span className="text-red-600">Total: ${item.total}</span>
                </span>
              </>
            ) : (
              <>
                ❌ {item.name}:{" "}
                <span className="text-xs text-BgFont">${item.price}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <br />
      <p className="text-sm lg:text-lg text-BgFont font-bold">
        Total Cost: ${userSelections.grandTotal || 0}
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
