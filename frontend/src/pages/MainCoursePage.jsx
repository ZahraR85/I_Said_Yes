import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCateringContext } from "../context/CateringContext";

const mainCourseItems = [
  { name: "Grilled Chicken with Herbs", price: 15 },
  { name: "Beef Stroganoff with Rice", price: 18 },
  { name: "Vegetarian Lasagna", price: 14 },
  { name: "Pan-Seared Salmon with Lemon Butter Sauce", price: 20 },
  { name: "Lamb Chops with Rosemary Sauce", price: 22 },
  {
    name: "Shrimp Alfredo",
    price: 20,
    variants: [
      "Classic",
      "Garlic Parmesan",
      "Spicy",
      "Low-Calorie",
      "Gluten-Free",
    ],
  },
  { name: "Roast Turkey with Cranberry Sauce", price: 19 },
  { name: "BBQ Baby Back Ribs", price: 25 },
  { name: "Stuffed Bell Peppers", price: 16 },
  { name: "Chicken Marsala", price: 18 },
  { name: "Eggplant Parmesan", price: 14 },
  {
    name: "Beef Wellington",
    price: 28,
    variants: ["Classic", "Mushroom-Free", "Spicy Glaze", "Vegetarian"],
  },
  {
    name: "Seafood Paella",
    price: 30,
    variants: ["Classic", "Spicy", "Low-Calorie", "Gluten-Free"],
  },
  { name: "Baked Ziti with Meat Sauce", price: 16 },
  { name: "Herb-Crusted Pork Loin", price: 20 },
  { name: "Vegetarian Stir-Fry", price: 14 },
  { name: "Grilled Tuna Steak", price: 24 },
  { name: "Honey-Glazed Duck Breast", price: 26 },
  { name: "Mushroom Risotto", price: 17 },
  { name: "Spinach and Ricotta Ravioli", price: 15 },
  {
    name: "Chicken Tikka Masala",
    price: 18,
    variants: ["Classic", "Mild", "Spicy", "Gluten-Free"],
  },
  {
    name: "Vegetable Curry",
    price: 16,
    variants: ["Classic", "Coconut Milk", "Spicy", "Vegan", "Gluten-Free"],
  },
];

const MainCoursePage = () => {
  const { state, updateFeature } = useCateringContext();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(
    state.features.MainCourse.selectedItems || {}
  );

  useEffect(() => {
    const initialData = {};
    mainCourseItems.forEach((item) => {
      initialData[item.name] = {
        quantity: 0,
        variant: item.variants?.[0] || null,
      };
    });
    setSelectedItems(state.features.MainCourse.selectedItems || initialData);
  }, [state.features.MainCourse.selectedItems]);

  const handleItemChange = (e, item) => {
    const quantity = Math.max(0, parseInt(e.target.value) || 0);
    setSelectedItems((prev) => ({
      ...prev,
      [item.name]: { ...prev[item.name], quantity },
    }));
  };

  const handleVariantChange = (e, item) => {
    const variant = e.target.value;
    setSelectedItems((prev) => ({
      ...prev,
      [item.name]: { ...prev[item.name], variant },
    }));
  };

  const handleSave = () => {
    const totalPrice = mainCourseItems.reduce((sum, item) => {
      const itemQuantity = selectedItems[item.name]?.quantity || 0;
      return sum + itemQuantity * item.price;
    }, 0);

    updateFeature("MainCourse", totalPrice, selectedItems); // Save to context
    navigate("/catering");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Main Course Items</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Price (€)</th>
            <th className="border px-4 py-2">Variant</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {mainCourseItems.map((item) => (
            <tr key={item.name}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">
                {item.variants ? (
                  <select
                    value={
                      selectedItems[item.name]?.variant || item.variants[0]
                    }
                    onChange={(e) => handleVariantChange(e, item)}
                    className="p-2 border rounded"
                  >
                    {item.variants.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={selectedItems[item.name]?.quantity || 0}
                  onChange={(e) => handleItemChange(e, item)}
                />
              </td>
              <td className="border px-4 py-2">
                {(selectedItems[item.name]?.quantity || 0) * item.price} €
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

export default MainCoursePage;
