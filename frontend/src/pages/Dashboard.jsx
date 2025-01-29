import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Music from "../components/MusicComponent";
import InformationUser from "../components/InformationUser";
import MakeupUser from "../components/UserMakeup";
import Todolist from "../components/ListToDo";
import Countdown from "../components/DownCount";
import Catering from "../components/UserCatering";
import PhotographyUserSelection from "../components/PhotographyUserSelection";
import Venue from "../components/venue";
import Story from "../components/StoryOfUser";
import AI from "../components/DashboardAI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { userId, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingDate, setWeddingDate] = useState(null);
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must sign in to access this page.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        if (!isAuthenticated) {
          toast.warn("You must sign in to access this page.");
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userinfoes/check/${userId}`
        );

        if (response.data.exists === false) {
          console.warn("User info does not exist. Redirecting...");
          navigate("/userinfo");
        }
      } catch (err) {
        console.error("Error checking user info:", err.message);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserInfo();
  }, [userId, isAuthenticated, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 px-2 bg-neutral-200">
      <ToastContainer />
      {/* User Information as Header */}
      <div className="flex justify-center items-center p-4 bg-[#e8dfcf] shadow-2xl rounded-lg">
        <InformationUser userId={userId} setWeddingDate={setWeddingDate} />
      </div>

      {/* Countdown and Todolist in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-2">
        <div className="flex justify-center items-center p-4 rounded-full shadow-2xl bg-[#e8dfcf] h-[200px] lg:h-[300px]">
          <Countdown weddingDate={weddingDate} />
        </div>
        <div className="flex justify-center items-center p-4 rounded-3xl shadow-2xl bg-[#e8dfcf] h-[200px] lg:h-[300px]">
          <Todolist userId={userId} />
        </div>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-BgFont text-center my-2 bg-[#e8dfcf] p-4 font-serif rounded-lg shadow-md">
        Dashboard Overview
      </h2>

      {/* Rest of the components in one row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-BgFont text-center mb-4 bg-[#e8dfcf] p-2 rounded-full font-serif shadow">
            Music
          </h2>
          <div className="flex justify-center items-center p-4 rounded-3xl shadow bg-[#f5d0cb] w-[350px] h-[500px]">
            <Music userId={userId} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-BgFont text-center mb-4 bg-[#e8dfcf] p-2 rounded-full font-serif shadow">
            Catering
          </h2>
          <div className="flex justify-center items-center p-4 rounded-3xl shadow bg-[#e8dfcf] bg-gradient-to-br w-[350px] h-[500px]">
            <Catering userId={userId} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-BgFont text-center mb-4 bg-[#e8dfcf] p-2 rounded-full font-serif shadow">
            Makeup
          </h2>
          <div className="flex justify-center items-center p-4 rounded-3xl shadow bg-[#fff2f4] w-[350px] h-[500px]">
            <MakeupUser userId={userId} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-BgFont text-center mb-4 bg-[#e8dfcf] p-2 rounded-full font-serif shadow">
            Photography
          </h2>
          <div className="flex justify-center items-center p-4 rounded-3xl shadow bg-[#d5c0b5] w-[350px] h-[500px]">
            <PhotographyUserSelection userId={userId} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          {/* <h2 className="text-3xl font-bold text-center mb-4 bg-[#e8dfcf] p-2 rounded-full shadow">Venue</h2> */}
          <div className="flex justify-center items-center p-4 rounded-full shadow-2xl bg-[#fff2f4] h-[400px] w-[400px]">
            <Venue userId={userId} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          {/* <h2 className="text-3xl font-bold text-center mb-4 bg-[#e8dfcf] p-2 rounded-full shadow">story</h2> */}
          <div className="flex justify-center items-center p-4 rounded-3xl shadow-2xl bg-[#e8dfcf] h-[400px]">
            <Story userId={userId} setWeddingDate={setWeddingDate} />
          </div>
        </div>
      </div>

      <AI />
    </div>
  );
};

export default Dashboard;
