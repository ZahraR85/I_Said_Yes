import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Catering = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    { name: "Starter", totalPrice: 0 },
    { name: "MainCourse", totalPrice: 0 },
    { name: "Dessert", totalPrice: 0 },
    { name: "ColdDrink", totalPrice: 0 },
    { name: "CafeBar", totalPrice: 0 },
    { name: "Fruits", totalPrice: 0 },
    { name: "Cake", totalPrice: 0 },
    { name: "Waiter", totalPrice: 0 },
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catering Categories</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Total Price (€)</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-2">{category.totalPrice}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() =>
                    navigate(
                      `/Catering/CateringItemsSelection/${category.name.toLowerCase()}`
                    )
                  }
                >
                  Choose Your Favorite {category.name}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Catering;
