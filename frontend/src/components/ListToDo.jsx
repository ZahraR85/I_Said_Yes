import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Todolist = ({ userId }) => {
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("Error: User ID is not provided.");
      setError("User ID is not provided.");
      return;
    }

    const fetchProgressData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/todolist/progress/${userId}`
        );
        setProgressData(response.data);
      } catch (err) {
        console.error("Error fetching progress data:", err.message);
        setError("Failed to fetch progress data.");
      }
    };

    fetchProgressData();
  }, [userId]);

  if (error) return <div>{error}</div>;
  if (!progressData) return <div>Loading progress data...</div>;

  const {
    completedCount,
    totalModels,
    percentageDone,
    progressData: modelProgress,
  } = progressData;

  const pieData = {
    labels: ["Done", "Not Yet"],
    datasets: [
      {
        label: "Progress",
        data: [completedCount, totalModels - completedCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="user-selections text-BgFont">
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {/* Vertical Table */}
        <div>
          <table
            border="1"
            style={{ borderCollapse: "collapse", textAlign: "left" }}
          >
            {/* <thead>
                            <tr>
                                <th>Category</th>
                                <th>Status</th>
                            </tr>
                        </thead> */}
            <tbody>
              {Object.entries(modelProgress).map(([key, value], index) => (
                <tr key={index}>
                  <td style={{ padding: "4px", textAlign: "center" }}>
                    {value ? "✔️" : "❌"}
                  </td>
                  <td style={{ padding: "4px" }}>{key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie Chart */}
        <div style={{ width: "250px", height: "250px" }}>
          <Pie
            data={pieData}
            options={{
              maintainAspectRatio: false,
            }}
          />
          <p
            style={{
              textAlign: "center",
              marginTop: "4px",
              marginBottom: "2px",
            }}
          >
            {percentageDone}% DONE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Todolist;
