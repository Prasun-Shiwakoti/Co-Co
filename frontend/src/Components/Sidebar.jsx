import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname === '/login' || location.pathname === '/')
      visibility(false)
    else
      visibility(true)
  }, [location.pathname])

  const visibility = (bool) => {
    setVisible(bool)
  }
  console.log(visible)
  if (!visible)
    return null
  else
    return (
      <div className="  w-[20%]  h-screen flex bg-blue-50 z-10">
        <div className="w-[100%] h-full bg-blue-50 flex flex-col items-center py-6  ">
          <div className="h-[10vh] flex items-center justify-center">
            <div className="text-center mt-4 bg-transparent">
              <h1
                className="text-5xl font-bold text-blue-900 m-6 bg-transparent cursor-pointer "
                style={{
                  textShadow: "none",
                  transition: "text-shadow 0.3s ease", // Optional smooth transition
                }}
                onMouseEnter={(e) => {
                  e.target.style.textShadow = "2px 2px 10px #90caf9";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textShadow = "none";
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                COCO
              </h1>

              <hr className="w-[100%] h-1 border-blue-900 mx-auto" />
            </div>
          </div>
          <ul className="mt-12 w-3/4 flex flex-col gap-4  ">
            <li className=" text-start">
              <button
                className={`w-full py-2 px-4 border-blue-900 rounded-full hover:shadow-xl hover:shadow-blue-100  text-start ${location.pathname === "/subjects"
                  ? "bg-blue-900 text-blue-50"
                  : " bg-white text-blue-900"
                  }`}
                onClick={() => {
                  navigate("/subjects");
                }}
              >
                Subjects
              </button>
            </li>
            <li>
              <button
                className={`w-full py-2 px-4 border rounded-full  hover:shadow-xl  hover:shadow-blue-100 text-start ${location.pathname === "/dashboard"
                  ? "bg-blue-900 text-blue-50"
                  : " bg-white text-blue-900"
                  }`}
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full py-2 px-4 border hover:shadow-xl  hover:shadow-blue-100 rounded-full text-start ${location.pathname === "/notes"
                  ? "bg-blue-900 text-blue-50"
                  : " bg-white text-blue-900"
                  }`}
                onClick={() => {
                  navigate("/notes");
                }}
              >
                Notes
              </button>
            </li>
            <li>
              <button
                className={`w-full py-2 px-4 border hover:shadow-xl hover hover:shadow-blue-100 rounded-full text-start ${location.pathname === "/flashcards"
                  ? "bg-blue-900 text-blue-50"
                  : " bg-white text-blue-900"
                  }`}
                onClick={() => {
                  navigate("/flashcards");
                }}
              >
                FlashCards
              </button>
            </li>
          </ul>
          <button className="mt-auto w-3/4 hover:shadow-xl hover:shadow-blue-100  text-blue-900 bg-white hover:text-blue-900 hover:bg-blue-50 rounded-full py-2 px-4 transition  text-start  ">
            Generate
          </button>
        </div>
      </div>
    );
};

export default Sidebar;
