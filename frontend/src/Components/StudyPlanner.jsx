import React from "react";
import { FaUser } from "react-icons/fa";
import Planner from "./Planner";

const StudyPlanner = () => {
  const backendData = [
    [
      { sub: "History", duration: 3.05 },
      { sub: "Math", duration: 2.05 },
      { sub: "Science", duration: 1.86 },
    ],
    [
      { sub: "Math", duration: 2.57 },
      { sub: "Math", duration: 1.2 },
    ],
    [
      { sub: "History", duration: 1.4 },
      { sub: "English", duration: 2.26 },
    ],
    [
      { sub: "History", duration: 2.74 },
      { sub: "Geography", duration: 2.26 },
    ],
    [
      { sub: "Geography", duration: 2.53 },
      { sub: "Math", duration: 2.47 },
    ],
    [
      { sub: "Math", duration: 3.31 },
      { sub: "Science", duration: 1.69 },
    ],
    [{ sub: "Science", duration: 5 }],
  ];
  return (
    <div className="w-[80%]">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className=" p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Planner</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>

      <Planner weekData={backendData} />
    </div>
  );
};

export default StudyPlanner;
