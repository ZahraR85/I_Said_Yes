import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import SearchCity from "./SearchCity";

const Header1 = ({ onScrollToSearchVenues }) => {
  const { selectedCity, setSelectedCity } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderImages = [
    "https://i.postimg.cc/FKdtnM9d/photo2.jpg",
    "https://i.postimg.cc/1XS45qSp/bridemaids2.jpg",
    "https://i.postimg.cc/fytBhnfF/makeup20.jpg",
    "https://i.postimg.cc/Dz7WVrc3/hair-Style1.png",
    //"https://i.postimg.cc/wMB8VqcC/Makeup18.jpg",
    "https://i.postimg.cc/6pPGJJgC/music2.jpg",
    "https://i.postimg.cc/T1Wpd7qp/photo5.jpg",
    "https://i.postimg.cc/BvWN4kT1/photo3.webp",
    "https://i.postimg.cc/KjX8JmK8/my.jpg",
    "https://i.postimg.cc/2SC8M8Jq/photo1.jpg",
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleSearch = (city) => {
    console.log("Search for:", city);
  };

  // Automatically change images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <header className="relative h-screen overflow-hidden">
      <div className="relative h-full">
        <img
          src={sliderImages[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-BgPinkMiddle text-white p-3 rounded-full hover:bg-BgPinkDark z-10"
        >
          &#8592;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-BgPinkMiddle text-white p-3 rounded-full hover:bg-BgPinkDark z-10"
        >
          &#8594;
        </button>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-white" : "bg-BgPinkDark"
              }`}
            ></button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <p className="text-xl font-light mb-4">
          Welcome to our amazing platform! Explore everything we have to offer.
        </p>
        <SearchCity
          selectedCity={selectedCity}
          setSelectedCity={(city) => {
            setSelectedCity(city);
            onScrollToSearchVenues();
          }}
          onSearch={handleSearch}
        />
      </div>
    </header>
  );
};

export default Header1;
