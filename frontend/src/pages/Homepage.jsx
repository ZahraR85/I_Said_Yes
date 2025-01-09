import { useRef } from "react";
import Features1 from '../components/feature1';
import Header1 from '../components/Header1';
//import GallerySlider from '../components/GallerySlider';
//import GallerySlider1 from '../components/GallerySlider1';
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
      <div ref={searchVenuesRef} > {/* Attach ref to SearchVenues */}
        <SearchVenues />
      </div>
      <Feedback />
      <Features1 />
      <Staff />
      {/*<Features />*/}
      {/* <GallerySlider /> */}
      {/* <GallerySlider1 /> */}
    </div>
  );
};

export default Homepage;
