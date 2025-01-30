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
          `${import.meta.env.VITE_API_URL}/cateringselections/${userId}`
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

  // Process the nested items into a flat structure
  const items = userSelections.selectedItems.flatMap((category) =>
    category.items.map((item) => ({
      category: category.category,
      name: item.ItemName,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))
  );

  if (items.length === 0) {
    return <p>No items selected for this user.</p>;
  }

  return (
    <div className="user-selections mx-auto max-w-xl text-BgFont space-y-2 lg:space-y-4 p-1 lg:p-4">
      <div className="space-y-1 lg:space-y-4">
        {items.map((item, index) => (
          <div key={index} className="text-xs lg:text-m font-bold">
            {item.quantity > 0 ? (
              <>
                ✔ {item.name} ({item.category}):{" "}
                <span className="text-xs text-BgFont font-semibold">
                  ${item.price} for {item.quantity} person{" "}
                  <span className="text-red-600">Total: ${item.total}</span>
                </span>
              </>
            ) : (
              <>
                ❌ {item.name} ({item.category}):{" "}
                <span className="text-xs text-BgFont">${item.price}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <br />
      <br />
      <p className="text-xs lg:text-lg text-BgFont font-bold">
        Total Cost: ${userSelections.grandTotal || 0}
      </p>
      <p className="text-xxs lg:text-m text-BgFont">
        Last Updated:{" "}
        {userSelections.updatedAt
          ? new Date(userSelections.updatedAt).toLocaleString()
          : "No Update Info"}
      </p>
    </div>
  );
};

export default UserSelections;
