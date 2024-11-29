import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import Fire from "../images/fire-flame.gif";
import Ice from "../images/freezing-cold.gif";
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
  const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 5000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 5000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, [stats]);

  const fetchStats = async () => {
    setLoading(true);

    try {
      const res = await fetch("");
      await res.json().then((response) => {
        if (response.ok) {
          setLoading(false);
          setStats(response);
        } else {
          setLoading(false);
          setError(response.message);
          setTimeout(() => {
            setError("");
          });
        }
      });
    } catch (err) {
      setLoading(false);
      setError(err.message);
      setTimeout(() => {
        setError("");
      });
    }
  };

  return (
    <div className="w-[80%] h-screen ">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className="flex-1 flex flex-col p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">
                Dashboard
              </h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="m-8 flex-row flex gap-5 w-[75%]">
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold">Notes:</p>
            <h1 className="text-4xl font-bold">0</h1>
          </div>
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold">Flashcard:</p>
            <h1 className="text-4xl font-bold">0</h1>
          </div>
          <div className="w-[25%] rounded-xl bg-transparent flex flex-col items-center p-4 shadow-xl">
            <p className="text-2xl font-bold text-center">Quizz :</p>
            <h1 className="text-4xl font-bold">0</h1>
          </div>
        </div>

        <div className="w-[25%] gap-2 rounded-tl-full rounded-bl-full flex h-32 items-center p-2 border-t border-l border-b bg-orange-200 mt-8 shadow-xl shadow-orange-100">
          <h1 className="text-4xl text-orange-600 ml-6 font-bold drop-shadow-[0_2px_2px_rgba(249,115,22,0.8)]">
            Streak:
          </h1>
          <h1 className="text-4xl text-orange-600 font-bold drop-shadow-[0_2px_2px_rgba(249,115,22,0.8)]">
            0
          </h1>
          <img src={Fire} className="w-[60px]" alt="fire icon" />
        </div>
        {/* <div className="w-[25%] gap-2 rounded-tl-full rounded-bl-full flex h-32 items-center p-2 border-t border-l border-b bg-sky-200 mt-8 shadow-xl shadow-sky-100">
          <h1
            className="text-4xl text-sky-600 ml-6 font-bold drop-shadow-[0_2px_2px_rgba(135,206,235,0.8)]
"
          >
            Streak:
          </h1>
          <h1
            className="text-4xl text-sky-600 font-bold drop-shadow-[0_2px_2px_rgba(135,206,235,0.8)]
"
          >
            -
          </h1>
          <img src={Ice} className="w-[60px]" alt="fire icon" />
        </div> */}
      </div>

      <div>
        <div className="charts-container flex gap-8 justify-center">
          <div className="chart w-[45%] m-8">
            <ResponsiveContainer
              width="100%"
              height={300}
              className="border-slate-500 border rounded-lg shadow-xl pt-4"
            >
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="chart w-[45%] m-8">
            <ResponsiveContainer
              width="100%"
              height={300}
              className="border-slate-500 border rounded-lg shadow-xl pt-4"
            >
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
