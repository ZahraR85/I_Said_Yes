

import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Features1 from '../components/feature1';
import Header1 from '../components/Header1';
import Feedback from '../components/feedback';
import SearchVenues from "../components/SearchVenues.jsx";
import Staff from "../components/Staff";





const Homepage = () => {
  const searchVenuesRef = useRef(null);


  const scrollToSearchVenues = () => {
    searchVenuesRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
  };
  return (
    <div>
      <Header1 onScrollToSearchVenues={scrollToSearchVenues} />
      <div ref={searchVenuesRef}>
        <SearchVenues />
      </div>
      <Feedback />
      <Features1 />
      <Staff />
      <ToastContainer />
       
    </div>
  );
};

export default Homepage;























    
