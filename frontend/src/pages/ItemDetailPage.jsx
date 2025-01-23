import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ItemDetailPage = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null); // Item details
  const [quantity, setQuantity] = useState(0); // Quantity for the item
  const [totalPrice, setTotalPrice] = useState(0); // Calculated total price
  const navigate = useNavigate(); // Hook to navigate after adding to cart

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings/${id}`
        );
        const data = await response.json();
        setItem(data);
        setTotalPrice(data.price * quantity); // Calculate initial total price
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [id, quantity]);

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    if (item) {
      setTotalPrice(item.price * newQuantity); // Recalculate total price
    }
  };

  const handleAddToCart = () => {
    // Logic to save item to cart (e.g., store in localStorage or backend)
    navigate("/cateringPage"); // Navigate back to the previous page
  };

  if (!item) {
    return <div>Loading...</div>; // Show loading state while fetching item
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{item.ItemName}</h1>

      <div className="flex gap-6">
        <img
          src={item.imagePath}
          alt={item.ItemName}
          className="h-80 w-80 object-cover rounded-lg"
        />
        <div>
          <p className="font-bold text-xl mt-2">{item.category}</p>
          <p className="text-lg">{item.VariantDescription}</p>
          <p className="font-bold text-xl mt-2">${item.price}</p>

          <div className="mt-4">
            <label htmlFor="quantity" className="mr-2 font-semibold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="0"
              onChange={handleQuantityChange}
              className="border rounded px-2 py-1 w-20"
            />
          </div>

          <div className="mt-4">
            <p className="font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
