import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Carousel from "react-bootstrap/Carousel";
import { useParams } from "react-router-dom";
import { PiCardsFill } from "react-icons/pi";

import "./FlashCards.css";
const FlashCards = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const flipAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  useEffect(() => {
    fetchFlashCards();
  }, []);

  const fetchFlashCards = async () => {
    try {
      const res = await fetch(`http://10.10.11.29:8000/flashcard?id=${id}`, {
        method: "GET",
        headers: {
          authorization: `token ${token}`,
        },
      });
      const response = await res.json();
      console.log(response);
      setFlashCards(response.data[0].cards);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      setTimeout(() => {
        setError("");
      });
    }
  };

  return (
    <div className="w-[80%] mx-auto">
      <div className="flex-col flex items-center justify-center">
        <div className="flex flex-col p-4 w-[100%] ">
          <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh] ">
            <PiCardsFill className="text-blue-900 text-2xl ml-4" />
            <h1 className="text-blue-900 text-2xl font-bold ml-2">
              FlashCards
            </h1>
          </div>
        </div>
        <hr className="border-blue-900 w-[95%]" />
      </div>
      <Carousel className=" h-[80vh] flex items-center " interval={null}>
        {console.log(flashCards)}
        {flashCards.map((card) => (
          <Carousel.Item>
            <div
              className="flex items-center justify-center h-full cursor-pointer shadow-xl shadow-blue-200"
              onClick={flipAnswer}
            >
              <div className="flashcard p-6 bg-blue-200 text-center rounded-lg w-[80%] max-w-[800px]">
                <h3 className="text-xl font-bold">Flashcard 1</h3>
                <p className="text-lg mt-2">{card}</p>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default FlashCards;
