import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCateringContext } from "../context/CateringContext";

const starterItems = [
  { name: "Onion Rings", price: 10 },
  { name: "Chicken Wings", price: 12 },
  { name: "Fish and Chips", price: 15 },
  { name: "Mozzarella Sticks", price: 9 },
  { name: "Stuffed Mushrooms", price: 13 },
];

const StarterPage = () => {
  const { state, updateFeature } = useCateringContext();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(
    state.features.Starter.selectedItems || {}
  );

  useEffect(() => {
    // Initialize state with default values if not present
    const initialData = {};
    starterItems.forEach((item) => {
      initialData[item.name] = selectedItems[item.name] || 0;
    });
    setSelectedItems(initialData);
  }, [state.features.Starter.selectedItems]);

  const handleItemChange = (e, item) => {
    const quantity = Math.max(0, parseInt(e.target.value) || 0);
    const newSelectedItems = { ...selectedItems, [item.name]: quantity };
    const totalPrice = starterItems.reduce(
      (sum, item) => sum + (newSelectedItems[item.name] || 0) * item.price,
      0
    );

    setSelectedItems(newSelectedItems);
    updateFeature("Starter", totalPrice, newSelectedItems); // Update context
  };

  const handleSave = () => {
    navigate("/catering");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Starter Items</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Price (€)</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {starterItems.map((item) => (
            <tr key={item.name}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={selectedItems[item.name]}
                  onChange={(e) => handleItemChange(e, item)}
                />
              </td>
              <td className="border px-4 py-2">
                {(selectedItems[item.name] || 0) * item.price} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
      >
        Save and Return
      </button>
    </div>
  );
};

export default StarterPage;
