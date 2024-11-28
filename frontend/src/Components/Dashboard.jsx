import React from "react";
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
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
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  ];

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

      <div className="flex-col flex items-center justify-center">
        <div className="w-[100%]  flex justify-between">
          <div>
            {" "}
            <h1>Breadcrumb</h1>
          </div>
          <Button className="mt-2 mb-2 mr-8">1xStreak</Button>
        </div>
        <hr className="border-blue-900 w-[95%]"></hr>
      </div>
      <div className="m-8 flex justify-center gap-5">
        <div className="w-[20%] rounded-xl bg-blue-100 flex flex-col items-center p-4 shadow-xl  ">
          <p className="text-2xl font-bold">Notes:</p>
          <h1 className="text-4xl font-bold">0</h1>
        </div>
        <div className="w-[20%] rounded-xl bg-blue-100 flex flex-col items-center p-4 shadow-xl">
          <p className="text-2xl font-bold">Flashcard:</p>
          <h1 className="text-4xl font-bold">0</h1>
        </div>
        <div className="w-[20%] rounded-xl bg-blue-100 flex flex-col items-center p-4 shadow-xl">
          <p className="text-2xl font-bold">Quiz:</p>
          <h1 className="text-4xl font-bold">0</h1>
        </div>
      </div>
      <div>
        <div className="charts-container ">
          <div className="chart m-8  ">
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

          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
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
