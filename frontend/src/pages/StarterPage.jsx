import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const starterItems = [
  { name: "Onion Rings", price: 10 },
  { name: "Chicken Wings", price: 12 },
  { name: "Fish and Chips", price: 15 },
  { name: "Mozzarella Sticks", price: 9 },
  { name: "Stuffed Mushrooms", price: 13 },
];

const StarterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const featureName = location.state?.featureName || "Starter";
  const [selectedItems, setSelectedItems] = useState({});

  const handleItemChange = (e, item) => {
    const quantity = Math.max(0, parseInt(e.target.value) || 0);
    setSelectedItems((prev) => ({
      ...prev,
      [item.name]: quantity * item.price,
    }));
  };

  const handleSave = () => {
    const total = Object.values(selectedItems).reduce(
      (sum, price) => sum + price,
      0
    );
    navigate("/catering", { state: { featureName, total } });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{featureName} Items</h1>
      <table className="table-auto w-full max-w-4xl border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Item</th>
            <th className="border border-gray-300 px-4 py-2">Price (€)</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {starterItems.map((item) => (
            <tr key={item.name}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.price}</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleItemChange(e, item)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {selectedItems[item.name] || 0} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 text-white py-2 px-6 rounded"
      >
        Save and Return
      </button>
    </div>
  );
};

export default StarterPage;
