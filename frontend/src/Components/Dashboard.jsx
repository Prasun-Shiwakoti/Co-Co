import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import Fire from "../images/fire-flame.gif";
import Ice from "../images/freezing-cold.gif";
import { RxDashboard } from "react-icons/rx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ avgQuizScoreData: [], sessionTimeData: [] });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchFlashCards();
  }, []);

  const fetchFlashCards = async () => {
    try {
      const res = await fetch(`http://10.10.11.29:8000/flashcard/`, {
        method: "GET",
        headers: {
          "authorization": `token ${token}`,
        },
      });
      const response = await res.json();
      setFlashCards(response.data[0].cards);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://10.10.11.29:8000/student/", {
        method: "GET",
        headers: { "authorization": `token ${token}` },
      });
      const response = await res.json();
      if (response.status) {
        setLoading(false);
        const userStats = response.data[0];
        setStats(userStats);

        // Prepare data for charts
        const avgQuizScoreData = Object.entries(userStats.stats.avg_quiz_score).map(([date, values]) => ({
          date,
          average: values.average,
        }));

        const sessionTimeData = Object.entries(userStats.stats.session_time).map(([date, time]) => ({
          date,
          time,
        }));

        setChartData({ avgQuizScoreData, sessionTimeData });
      } else {
        setLoading(false);
        setError(response.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="w-[80%] h-screen">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className="flex-1 flex flex-col p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <RxDashboard className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Dashboard</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%]" />
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="m-8 flex-row flex gap-5 w-[75%]">
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold">Topics:</p>
            <h1 className="text-4xl font-bold">{stats.subjects?.length}</h1>
          </div>
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold">Flashcard:</p>
            <h1 className="text-4xl font-bold">{flashCards.length}</h1>
          </div>
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold text-center">Quizz :</p>
            <h1 className="text-4xl font-bold">{chartData.avgQuizScoreData.length}</h1>
          </div>
        </div>

        <div className="w-[25%] gap-2 rounded-tl-full rounded-bl-full flex h-32 items-center p-2 border-t border-l border-b bg-orange-200 mt-8 shadow-xl shadow-orange-100">
          <h1 className="text-4xl text-orange-600 ml-6 font-bold drop-shadow-[0_2px_2px_rgba(249,115,22,0.8)]">
            Streak:
          </h1>
          <h1 className="text-4xl text-orange-600 font-bold drop-shadow-[0_2px_2px_rgba(249,115,22,0.8)]">
            {stats.streak_count}
          </h1>
          <img src={Fire} className="w-[60px] mb-3" alt="fire icon" />
        </div>
      </div>

      <div>
        <div className="charts-container flex gap-8 justify-center">
          {/* Line Chart for Average Quiz Score */}
          <div className="chart w-[45%] m-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData.avgQuizScoreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for Session Time */}
          <div className="chart w-[45%] m-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData.sessionTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
