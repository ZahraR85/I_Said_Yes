import { useState, useEffect } from "react";
import axios from "axios";

const InformationUser = ({ userId, setWeddingDate }) => {
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

      <div className="mx-auto  max-w-[calc((6)0%-130px)] text-BgFont font-serif  space-y-4 p-4  ">
        <p
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {userInfo.brideName || "N/A"} <span>&</span>{" "}
          {userInfo.groomName || "N/A"}
        </p>

        <p>
          <strong>The Day We Will Begin Forever</strong>{" "}
          {userInfo.weddingDate
            ? new Date(userInfo.weddingDate).toLocaleDateString()
            : "N/A"}
        </p>

        {/* <p><strong>Our Story:</strong> {userInfo.story || "No story provided."}</p> */}

        {/* <p><strong>Last Updated:</strong> {userInfo.updatedAt ? new Date(userInfo.updatedAt).toLocaleString() : "N/A"}</p> */}

        {/* <p><strong>Feedback:</strong> {userInfo.feedback || "No feedback provided."}</p> */}
        {/* <p><strong>Bride's Birthday:</strong> {userInfo.brideBirthday ? new Date(userInfo.brideBirthday).toLocaleDateString() : "N/A"}</p> */}
        {/* <p><strong>Groom's Birthday:</strong> {userInfo.groomBirthday ? new Date(userInfo.groomBirthday).toLocaleDateString() : "N/A"}</p> */}
      </div>
    </div>
  );
};

export default InformationUser;
