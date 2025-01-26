import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/caterings/${id}`
        );
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{item.ItemName}</h1>
      <img
        src={item.imagePath}
        alt={item.ItemName}
        className="w-full h-[500px] object-cover rounded-lg"
      />
      <p className="text-lg mt-4">{item.category}</p>
      <p className="text-xl mt-2">{item.price} €</p>
      <p className="text-md mt-2">{item.VariantDescription}</p>
    </div>
  );
};

export default ItemDetailPage;
