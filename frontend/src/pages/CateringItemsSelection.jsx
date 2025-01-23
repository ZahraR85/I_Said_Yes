import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CateringItemsSelection = () => {
  const { category } = useParams(); // E.g., "starter"
  const navigate = useNavigate();

  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items for the selected category
  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const normalizedCategory = category.toLowerCase();
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/caterings/category/${normalizedCategory}`
        );
        setCategoryItems(response.data);
      } catch (error) {
        console.error("Error fetching items by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [category]);

  // Update the quantity for a selected item
  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = quantity;
    setSelectedItems(updatedItems);
  };

  // Calculate the total price for selected items
  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    const total = calculateTotal();
    // Navigate back to the categories page with the selected category and total
    navigate("/", { state: { categoryName, total } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Choose Your Favorite {categoryName}
      </h1>
      {categoryItems.length === 0 ? (
        <p>Loading items...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Item</th>
              <th className="border px-4 py-2">Price (€)</th>
              <th className="border px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.ItemName}</td>
                <td className="border px-4 py-2">{item.price}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value) || 0)
                    }
                    className="border px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Total Price: €{calculateTotal()}</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleConfirmSelection}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default CateringItemsSelection;
