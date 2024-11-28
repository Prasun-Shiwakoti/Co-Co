import React from "react";
import illustration from "../images/study illsutration.png";
import pattern from "../images/pattern-02.png";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="w-full h-screen bg-sky-50 flex items-center justify-center bg-[pattern] bg-cover bg-center">
      <img src={pattern} className="absolute opacity-25 " />
      <div className="text-center flex flex-col md:flex-row items-center justify-center gap-24  border rounded-xl p-40 shadow w-[80%] h-[80%] bg-sky-50 z-10">
        <div className="text-left">
          <h1 className="text-7xl font-bold 0 mb-4">COCO</h1>
          <h2 className="text-3xl font-semibold mb-2">
            Your Cognitive Companions
          </h2>
          <p className="text-lg mb-6">
            Turn Your Notes into Knowledge <br />
            Smarter, Faster, Better.
          </p>

          <Button
            className=" text-blue-50 bg-blue-900 hover:text-blue-900 hover:bg-blue-50 py-2 px-4 rounded-full transition  text-start"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
        <div>
          <img
            src={illustration}
            alt="Illustration of a kid studying"
            className="w-72 md:w-80 lg:w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;