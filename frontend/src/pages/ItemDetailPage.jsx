import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

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
    <div className="flex flex-row items-center gap-5 text-center p-5">
      <div>
        <img
          src={item.imagePath}
          alt={item.ItemName}
          className="w-full h-[500px] object-cover rounded-lg"
        />
      </div>
      <div className="text-center text-BgFont">
        <h1 className="text-m lg:text-2xl font-bold mb-4">{item.ItemName}</h1>
        <p className="text-m lg:text-lg mt-4">{item.category}</p>
        <p className="text-m lg:text-md mt-2">{item.VariantDescription}</p>
        <p className="text-m lg:text-xl mt-2 text-red-500 font-bold">
          {item.price} €
        </p>
        <button
          onClick={() => navigate(`/cateringPage`)}
          className="m-2 p-2 inline-block text-m lg:text-lg font-semibold bg-BgPinkMiddle hover:bg-BgPinkDark rounded"
        >
          back
        </button>
      </div>
    </div>
  );
};

export default ItemDetailPage;
