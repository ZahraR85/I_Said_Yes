import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../context/AppContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from 'react-icons/fa';
import "../App.css";

const ShoppingCard = () => {
  const { userId, isAuthenticated, shoppingCard, setShoppingCard } = useAppContext();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  // Redirect unauthenticated users to the sign-in page
  /*useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000); 
    }
  }, [isAuthenticated, navigate]);
*/
  // Fetch shopping card items from the backend
  const fetchShoppingCard = async () => {
    if (!userId) {
      toast.warn('User not authenticated. Please sign in.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/shoppingcards?userID=${userId}`);
      const { cardItems } = response.data;
      setShoppingCard(cardItems); // Update state with fetched data
    } catch (error) {
      console.error('Failed to fetch shopping card:', error);
      toast.error('Could not load shopping card. Please try again.');
    }
  };

  // Calculate total price whenever shopping card changes
  const calculateTotalPrice = () => {
    const total = shoppingCard.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };

  // Remove a service from the shopping card
  const removeService = async (serviceName) => {
    try {
      await axios.delete(`http://localhost:3001/shoppingcards`, {
        data: { userID: userId, serviceName },
      });

      // Update the state locally
      const updatedCard = shoppingCard.filter((item) => item.serviceName !== serviceName);
      setShoppingCard(updatedCard);
      setTotalPrice(updatedCard.reduce((sum, item) => sum + item.price, 0));

      toast.success('Service removed completely!');
    } catch (error) {
      console.error('Failed to remove service:', error);
      toast.error('Failed to remove service!');
    }
  };

  // Fetch shopping card when the component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchShoppingCard();
    }
  }, [userId]);

  // Recalculate total price whenever shopping card updates
  useEffect(() => {
    calculateTotalPrice();
  }, [shoppingCard]);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-customBg1">
      <ToastContainer />
      {/* Left Side: Shopping Card */}
      <div className="flex-1 p-4 md:p-10">
        <h2 className="text-xl lg:text-3xl font-bold text-center text-BgFont mb-6 md:mb-10">Your Shopping Card</h2>
        {shoppingCard.length === 0 ? (
          <p className="text-lg lg:text-xl text-BgFont text-center">Your shopping card is empty.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {shoppingCard.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-row items-center"
              >
                <h3 className="w-full md:w-1/3 text-lg lg:text-2xl font-semibold text-center text-red-500 m-2">
                  {item.serviceName}
                </h3>
                <span className="w-full md:w-1/3 text-m lg:text-lg text-BgFont font-semibold ml-10">
                  {item.price.toFixed(2)} $
                </span>
                <FaTrash
                  className="w-1/3 md:w-auto text-red-400 text-lg lg:text-2xl cursor-pointer hover:text-red-600 mt-4 md:mt-0"
                  onClick={() => removeService(item.serviceName)}
                  title="Delete"
                />
              </div>
            ))}
          </div>
        )}
        {shoppingCard.length > 0 && (
          <div className="mt-8 text-center">
            {/* <div className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</div>*/}
          </div>
        )}
      </div>

      {/* Right Side: Background Image */}
      <div
        className="relative flex-none w-full md:w-2/3 bg-cover bg-center"
        style={{ backgroundImage: `url('https://i.postimg.cc/XqYyy1GZ/shopping-Card1.jpg')` }}
      >
        {/* Centered Total Price */}
        {shoppingCard.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="bg-BgPink text-BgFont text-xl md:text-3xl font-bold p-4 mb-10 rounded-lg shadow-lg">
              Total: {totalPrice.toFixed(2)} €
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCard;
