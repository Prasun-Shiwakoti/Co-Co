import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import NoteCard from "./NoteCard";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizes, setQuizes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`http://10.10.11.29:8000/quiz/`, {
        headers: { "authorization": `token ${token}` }
      })
      await res.json().then(response => {
        if (response.ok) {
          setQuiz(response);
          setLoading(false);
        }
        else {
          setError('Error Fetching Quiz')
          setLoading(false);
          setTimeout(() => { setError(''), [3000] })
        }
      });
    } catch (err) {
      setError(err);
      setLoading(false)
      setTimeout(() => { setError(''), [3000] })
    }
  };

  return (
    <div className="w-[80%]">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className=" p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">
                Quizzes{" "}
              </h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>
      <div className="flex">
        {quizes.map((quiz, index) => (
          <Card
            style={{ width: "18rem" }}
            className="bg-transparent border-none "
          >
            <Card.Body
              className="m-8 bg-blue-100 p-4 rounded-lg h-auto cursor-pointer shadow-xl shadow-blue-200"
              onClick={() => {
                navigate(`/quiz/${quiz.id}`);
              }}
            >
              <Card.Title className="text-center text-2xl">
                {quiz.subjectName}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
