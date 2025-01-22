import { createContext, useContext, useState } from "react";

const CateringContext = createContext();

export const useCateringContext = () => useContext(CateringContext);

export const CateringProvider = ({ children }) => {
  const [featuresState, setFeaturesState] = useState({
    Starter: 0,
    MainCourse: 0,
    Dessert: 0,
    ColdDrink: 0,
    CafeBar: 0,
    Fruits: 0,
    Cake: 0,
    Waiter: 0,
  });

  const updateFeaturePrice = (featureName, price) => {
    setFeaturesState((prev) => ({
      ...prev,
      [featureName]: price,
    }));
  };

  return (
    <CateringContext.Provider value={{ featuresState, updateFeaturePrice }}>
      {children}
    </CateringContext.Provider>
  );
};
