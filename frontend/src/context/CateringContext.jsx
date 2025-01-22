import { createContext, useContext, useReducer } from "react";

const CateringContext = createContext();

const initialState = {
  features: {
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
    case "UPDATE_FEATURE":
      const { feature, totalPrice, selectedItems } = action.payload;
      return {
        ...state,
        features: {
          ...state.features,
          [feature]: { totalPrice, selectedItems },
        },
      };
    default:
      return state;
  }
};

export const CateringProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cateringReducer, initialState);

  const updateFeature = (feature, totalPrice, selectedItems) => {
    dispatch({
      type: "UPDATE_FEATURE",
      payload: { feature, totalPrice, selectedItems },
    });
  };

  return (
    <CateringContext.Provider value={{ state, updateFeature }}>
      {children}
    </CateringContext.Provider>
  );
};

export const useCateringContext = () => useContext(CateringContext);
