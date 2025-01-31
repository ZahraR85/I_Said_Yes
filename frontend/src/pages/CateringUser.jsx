import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const CateringUser = () => {
  // Access userId from AppContext
  const { userId, isAuthenticated, addToShoppingCard } = useAppContext();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch catering items when component mounts
    const fetchItems = async () => {
      try {
        const response = await axios.get("/caterings"); // Adjust URL based on your backend
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching catering items:", err);
      }
    };

    fetchItems();
  }, []);

  // Handle adding an item to the order
  const handleAddItem = (item) => {
    const newItem = { ...item, quantity: 1, description: "" };
    setSelectedItems([...selectedItems, newItem]);
  };

  // Handle item quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  // Handle item description change
  const handleDescriptionChange = (index, newDescription) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].description = newDescription;
    setSelectedItems(updatedItems);
  };

  // Calculate the total price based on selected items
  const calculateTotalPrice = (updatedItems) => {
    const price = updatedItems.reduce((total, item) => {
      const itemPrice = items.find((i) => i._id === item.CateringItemID).price;
      return total + itemPrice * item.quantity;
    }, 0);
    setTotalPrice(price);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/cateringusers", {
        userId, // Use userId from context
        items: selectedItems,
      });
      alert(response.data.message);
    } catch (err) {
      setError("Error saving the catering order.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Catering Order</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h3 className="font-semibold">Select Catering Items</h3>
          {items.map((item) => (
            <div key={item._id} className="flex items-center mb-2">
              <button
                type="button"
                onClick={() => handleAddItem(item)}
                className="btn btn-primary"
              >
                Add {item.name} to Order
              </button>
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">Your Selected Items</h3>
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="mb-2 p-4 border border-gray-300 rounded-md"
              >
                <p>{items.find((i) => i._id === item.CateringItemID)?.name}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                  className="border p-1 rounded mr-2"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder="Description"
                  className="border p-1 rounded"
                />
              </div>
            ))}
          </>
        )}

        <div className="mt-4">
          <p className="font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-4"
          >
            {loading ? "Processing..." : "Submit Order"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CateringUser;
