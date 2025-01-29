import { useState, useEffect } from "react";
import axios from "axios";

const StoryOfUser = ({ userId, setWeddingDate }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId) throw new Error("User ID is not provided.");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userinfoes/${userId}`
        );
        const data = response.data;

        if (data && data.weddingDate) {
          setWeddingDate(data.weddingDate); // Pass weddingDate to parent
        }

        setUserInfo(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, setWeddingDate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!userInfo) return <p>No user information found.</p>;

  return (
    <div className="user-info">
      {/* <h2 className="text-2xl font-bold mb-4">your Information</h2> */}

      <div className="mx-auto max-w-[calc((6)0%-130px)] text-BgFont font-serif text-xs lg:text-xl space-y-4 p-4">
        <p>
          <strong>Our Story:</strong> {userInfo.story || "No story provided."}
        </p>
      </div>
    </div>
  );
};

export default StoryOfUser;
