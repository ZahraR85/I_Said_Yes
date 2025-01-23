import { createContext, useContext, useReducer } from "react";

const CateringContext = createContext();

const initialState = {
  categories: {
    Starter: {
      totalPrice: 0,
      selectedItems: {}, // Keeps track of individual item quantities
    },
    MainCourse: {
      totalPrice: 0,
      selectedItems: {},
    },
    Dessert: {
      totalPrice: 0,
      selectedItems: {},
    },
    ColdDrink: {
      totalPrice: 0,
      selectedItems: {},
    },
    CafeBar: {
      totalPrice: 0,
      selectedItems: {},
    },
    Fruits: {
      totalPrice: 0,
      selectedItems: {},
    },
    Cake: {
      totalPrice: 0,
      selectedItems: {},
    },
    Waiter: {
      totalPrice: 0,
      selectedItems: {},
    },
  },
};

const cateringReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_CATEGORY":
      const { category, totalPrice, selectedItems } = action.payload;
      return {
        ...state,
        categoies: {
          ...state.categories,
          [category]: { totalPrice, selectedItems },
        },
      };
    default:
      return state;
  }
};

export const CateringProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cateringReducer, initialState);

  const updateCategory = (category, totalPrice, selectedItems) => {
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: { category, totalPrice, selectedItems },
    });
  };

  return (
    <CateringContext.Provider value={{ state, updateCategory }}>
      {children}
    </CateringContext.Provider>
  );
};

export const useCateringContext = () => useContext(CateringContext);
