import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const CateringUser = () => {
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const [cateringItems, setCateringItems] = useState([]);
  const [cateringUser, setCateringUser] = useState([]); // Default as an empty array
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchCateringItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings`
        );
        const data = await response.json();
        setCateringItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching catering items:", error);
      }
    };

    fetchCateringItems();
  }, []);
  // Fetch user's catering order
  useEffect(() => {
    axios
      .get(`/cateringusers/${userId}`)
      .then((response) => {
        const { selectedItems, grandTotal } = response.data;
        setCateringUser(selectedItems || []); // Ensure it defaults to an empty array if undefined
        setTotalPrice(grandTotal || 0); // Ensure total is a number
      })
      .catch((error) =>
        console.error("Error fetching user's catering order:", error)
      );
  }, []);

  const handleAddToCateringUser = (item) => {
    setCateringUser((prevUserItems) => [
      ...prevUserItems,
      { ...item, quantity: 1, description: "" },
    ]);
    updateTotalPrice();
  };

  const handleUpdateItem = (index, newQuantity, newDescription) => {
    const updatedUserItems = [...cateringUser];
    updatedUserItems[index].quantity = newQuantity;
    updatedUserItems[index].description = newDescription;
    setCateringUser(updatedUserItems);
    updateTotalPrice();
  };

  const updateTotalPrice = () => {
    const total = cateringUser.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleSaveCateringUser = () => {
    // Submit catering user data to backend
    const userId = "user-id"; // Get the logged-in user's ID dynamically
    axios
      .post("/cateringusers", {
        userId,
        items: cateringUser,
      })
      .then((response) => {
        console.log("Catering user saved:", response.data);
      })
      .catch((error) => console.error("Error saving catering user:", error));
  };

  return (
    <div>
      <h1>Catering Items</h1>
      <div className="grid grid-cols-3 gap-4">
        {cateringItems.map((item) => (
          <div key={item._id} className="card">
            <img src={item.imagePath} alt={item.ItemName} />
            <h3>{item.ItemName}</h3>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <button onClick={() => handleAddToCateringUser(item)}>
              Add to Catering Order
            </button>
          </div>
        ))}
      </div>

      <h2>Your Catering Order</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cateringUser && cateringUser.length > 0 ? (
            cateringUser.map((item, index) => (
              <tr key={item._id}>
                <td>{item.ItemName}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(index, e.target.value, item.description)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateItem(index, item.quantity, e.target.value)
                    }
                  />
                </td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No items in your catering order</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleSaveCateringUser}>Save Catering Order</button>
    </div>
  );
};

export default CateringUser;
