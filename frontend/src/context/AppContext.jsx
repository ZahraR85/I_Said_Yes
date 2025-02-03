import { createContext, useContext, useReducer, useEffect } from "react";
// import PropTypes from "prop-types";
import axios from "axios";

// Create context for app state
const AppContext = createContext();

// Initial state
const initialState = {
  selectedCity: "All Cities",
  selectedCapacity: "All Capacities",
  selectedPrice: "All Prices",
  searchTerm: "",
  hoveredDropdown: null,
  isDropdownOpen: false,
  userId: null, // User ID for authenticated user
  isAuthenticated: false, // Tracks if the user is authenticated
  role: null, // Role of the authenticated user
  shoppingCard: [], // State for shopping card items
};

// Define reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_CITY":
      return { ...state, selectedCity: action.payload };
    case "SET_SELECTED_CAPACITY": // Action for setting selected capacity
      return { ...state, selectedCapacity: action.payload };
    case "SET_SELECTED_PRICE": // Action for setting selected capacity
      return { ...state, selectedPrice: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_HOVERED_DROPDOWN":
      return { ...state, hoveredDropdown: action.payload };
    case "CLEAR_HOVERED_DROPDOWN":
      return { ...state, hoveredDropdown: null };
    case "SET_DROPDOWN_OPEN":
      return { ...state, isDropdownOpen: action.payload };
    case "SET_AUTH":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userId: action.payload.userId,
        role: action.payload.role, // Set Role on authentication
      };
    case "SIGN_OUT":
      return { ...state, isAuthenticated: false, userId: null, role: null };
    case "ADD_TO_SHOPPING_CARD": {
      if (!action.payload || !action.payload.serviceName) {
        console.error("Item must have a serviceName property");
        return state;
      }

      const isDuplicate = state.shoppingCard.some(
        (cardItem) => cardItem.serviceName === action.payload.serviceName
      );

      if (isDuplicate) {
        return state;
      }

      const uniqueItem = {
        ...action.payload,
        id: action.payload.serviceName + "-" + new Date().getTime(),
      };

      return {
        ...state,
        shoppingCard: [...state.shoppingCard, uniqueItem],
      };
    }

    case "REMOVE_FROM_SHOPPING_CARD":
      return {
        ...state,
        shoppingCard: state.shoppingCard.filter(
          (item) => item.id !== action.payload.id
        ),
      };

    case "SET_SHOPPING_CARD": // New action to replace the shopping card
      return {
        ...state,
        shoppingCard: action.payload,
      };

    default:
      return state;
  }
};

// AppProvider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const setSelectedCity = (city) =>
    dispatch({ type: "SET_SELECTED_CITY", payload: city });
  const setSelectedCapacity = (capacity) =>
    dispatch({ type: "SET_SELECTED_CAPACITY", payload: capacity });
  const setSelectedPrice = (price) =>
    dispatch({ type: "SET_SELECTED_PRICE", payload: price });
  const setSearchTerm = (term) =>
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  const setHoveredDropdown = (dropdown) =>
    dispatch({ type: "SET_HOVERED_DROPDOWN", payload: dropdown });
  const clearHoveredDropdown = () =>
    dispatch({ type: "CLEAR_HOVERED_DROPDOWN" });
  const setDropdownOpen = (isOpen) =>
    dispatch({ type: "SET_DROPDOWN_OPEN", payload: isOpen });

  useEffect(() => {
    const savedShoppingCard =
      JSON.parse(localStorage.getItem("shoppingCard")) || [];
    dispatch({ type: "SET_SHOPPING_CARD", payload: savedShoppingCard });
  }, []);

  useEffect(() => {
    localStorage.setItem("shoppingCard", JSON.stringify(state.shoppingCard));
  }, [state.shoppingCard]);
  const getUserProfile = async () => {
    try {
      const response = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setAuth(true, data.userId, data.role);
    } catch (error) {
      console.log(error);
      signOut();
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile();
    }
  }, []);

  const setAuth = (isAuthenticated, userId, role) => {
    if (isAuthenticated) {
      const savedShoppingCard =
        JSON.parse(localStorage.getItem("shoppingCard")) || [];
      dispatch({ type: "SET_SHOPPING_CARD", payload: savedShoppingCard });
    }
    dispatch({ type: "SET_AUTH", payload: { isAuthenticated, userId, role } });
  };

  const setShoppingCard = (shoppingCard) =>
    dispatch({ type: "SET_SHOPPING_CARD", payload: shoppingCard });

  const addToShoppingCard = (item) =>
    dispatch({
      type: "ADD_TO_SHOPPING_CARD",
      payload: { ...item, id: item.serviceName + "-" + Date.now() },
    });

  const removeFromShoppingCard = (itemId) =>
    dispatch({ type: "REMOVE_FROM_SHOPPING_CARD", payload: { id: itemId } });

  //const shoppingCardCount = state.shoppingCard.length;
  const shoppingCardCount = state.isAuthenticated
    ? state.shoppingCard.length
    : 0;

  const signOut = () => dispatch({ type: "SIGN_OUT" });
  // AppProvider.propTypes = {
  //   children: PropTypes.node.isRequired,
  // };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSelectedCity,
        setSelectedCapacity,
        setSelectedPrice,
        setSearchTerm,
        setHoveredDropdown,
        clearHoveredDropdown,
        setDropdownOpen,
        setAuth,
        signOut,
        addToShoppingCard,
        removeFromShoppingCard,
        setShoppingCard, // Expose new function
        shoppingCardCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access app context
export const useAppContext = () => useContext(AppContext);
