import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { CateringProvider } from "./context/CateringContext";
import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import AdminVenuePage from "./AdminVenue/AdminVenuePage.jsx";
//import VenueList from './pages/AdminVenue/VenueList.jsx';
import VenueDetialsAdmin from "./AdminVenue/VenueDetialsAdmin.jsx";
//import VenueCard from './AdminVenue/VenueCard.jsx';
import VenueSelection from "./pages/VenueSelection.jsx";
import VenueBooking from "./pages/VenueBooking.jsx";
import Photography from "./pages/Photography.jsx";
import MakeupSelector from "./pages/MakeupSelector.jsx";
//import MakeupDescriptionBox from './components/MakeupDescriptionBox.jsx';
import ReceptionSelector from "./pages/ReceptionSelector.jsx";
import Catering from "./pages/Catering.jsx";
import Guests from "./pages/Guests.jsx";
import Musics from "./pages/Music.jsx";
import SignIn from "./Auth/SignIn.jsx";
import Register from "./Auth/Register.jsx";
import GalleryManagement from "./AdminVenue/GalleryManagement.jsx";
import AdminMusicOption from "./AdminVenue/AdminMusicOption.jsx";
import Gallery from "./pages/Gallery.jsx";
import CategoryDetails from "./components/CategoryDetails.jsx";
import ShoppingCard from "./pages/ShoppingCard.jsx";
import SearchVenue from "./components/SearchVenue.jsx";
import VenueDetail from "./components/VenueDetail.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import FAQ from "./pages/FAQ.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CancelPage from "./pages/CancelPage.jsx";
import Menu from "./pages/Menu.jsx";
import StarterPage from "./pages/StarterPage.jsx";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/ShoppingCard" element={<ShoppingCard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Gallery" element={<Gallery />} />
            <Route path="/Gallery/:category" element={<CategoryDetails />} />
            <Route path="/UserInfo" element={<UserInfo />} />
            <Route path="/GalleryManagement" element={<GalleryManagement />} />
            <Route path="/AdminMusicOption" element={<AdminMusicOption />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            {/* Admin Routes */}
            <Route path="/Admin/Venue" element={<AdminVenuePage />} />
            <Route path="/Admin/Venue/:id" element={<VenueDetialsAdmin />} />
            {/* User Routes */}
            <Route path="/venueSelections" element={<VenueSelection />} />
            <Route path="/venueBooking/:venueId" element={<VenueBooking />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/Makeup" element={<MakeupSelector />} />
            <Route path="/ReceptionSelector" element={<ReceptionSelector />} />

            {/* Catering Routes */}
            <Route
              path="/Catering/*"
              element={
                <CateringProvider>
                  <Routes>
                    <Route path="/" element={<Catering />} />
                    <Route path="Starter" element={<StarterPage />} />
                  </Routes>
                </CateringProvider>
              }
            />

            <Route path="/Menu" element={<Menu />} />
            <Route path="/Guests" element={<Guests />} />
            <Route path="/Musics" element={<Musics />} />
            <Route path="/searchvenues" element={<SearchVenue />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/Success" element={<SuccessPage />} />
            <Route path="/Cancel" element={<CancelPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
