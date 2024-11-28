import React from "react";
import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="w-[80%] h-screen ">
      <div className="flex-col flex items-center justify-center">
        <div className="flex-1 flex flex-col p-4 w-[100%]">
          <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
            <FaUser className="text-blue-900 text-2xl ml-4" />
            <h1 className="text-blue-900 text-2xl font-bold ml-2">Dashboard</h1>
          </div>
        </div>
        <hr className="border-blue-900 w-[95%] " />
      </div>
    </div>
  );
};

export default Dashboard;
