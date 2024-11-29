import React, { useEffect, useState } from "react";
import { GiBrain } from "react-icons/gi";

import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import RightOffcanvas from "./OffCanvas";
const Sidebar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [showChatbot, setShowChatBot] = useState(false);

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === "/login" || location.pathname === "/")
      visibility(false);
    else visibility(true);
  }, [location.pathname]);

  const visibility = (bool) => {
    setVisible(bool);
  };
  console.log(visible);
  if (!visible) return null;
  else
    return (
      <div className="  w-[20%]  h-screen flex bg-blue-100 z-10">
        <div className="w-[100%] h-full bg-blue-100 flex flex-col items-center py-6  ">
          <div className="h-[10vh] flex items-center justify-center">
            <div className="text-center mt-4 bg-transparent">
              <h1
                className="text-5xl font-bold text-blue-900 m-6 bg-transparent cursor-pointer "
                style={{
                  textShadow: "none",
                  transition: "text-shadow 0.3s ease",
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
                className={`w-full py-2 px-4 border-blue-900 rounded-full hover:shadow-xl hover:shadow-blue-200  text-start ${location.pathname === "/subjects"
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
                className={`w-full py-2 px-4 border rounded-full  hover:shadow-xl  hover:shadow-blue-200 text-start ${location.pathname === "/dashboard"
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
                className={`w-full py-2 px-4 border hover:shadow-xl  hover:shadow-blue-200 rounded-full text-start ${location.pathname === "/notes"
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
            {/* <li>
              <button
                className={`w-full py-2 px-4 border hover:shadow-xl  hover:shadow-blue-200 rounded-full text-start ${
                  location.pathname === "/quiz"
                    ? "bg-blue-900 text-blue-50"
                    : " bg-white text-blue-900"
                }`}
                onClick={() => {
                  navigate("/quiz");
                }}
              >
                Quizes
              </button>
            </li> */}
            <li>
              <button
                className={`w-full py-2 px-4 border hover:shadow-xl hover hover:shadow-blue-200 rounded-full text-start ${location.pathname === "/flashcards"
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
            <li className=" text-start">
              <button
                className={`w-full py-2 px-4 border-blue-900 rounded-full hover:shadow-xl hover:shadow-blue-200  text-start ${location.pathname === "/planner"
                    ? "bg-blue-900 text-blue-50"
                    : " bg-white text-blue-900"
                  }`}
                onClick={() => {
                  navigate("/planner");
                }}
              >
                Study-Planner
              </button>
            </li>
          </ul>
        </div>
        {showChatbot ? (
          <Chatbot close={() => setShowChatBot(false)} />
        ) : (
          <div
            className="mt-auto hover:shadow-xl hover:shadow-blue-200 cursor-pointer bg-blue-900 rounded-full w-[60px] h-[60px] transition  text-start fixed right-0 bottom-0 flex items-center justify-center m-2"
            onClick={() => setShowChatBot(true)}
          >
            <GiBrain size={50} color="white" />
          </div>
        )}
        <div>
          <RightOffcanvas />
        </div>
      </div>
    );
};

export default Sidebar;
