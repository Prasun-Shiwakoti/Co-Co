import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import NoteCard from "./NoteCard";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizes, setQuizes] = useState([{ subjectName: "Science", id: '123' }, { subjectName: "Maths", id: '456' }]);

  return (
    <div className="w-[80%]">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className=" p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Quizes</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>
      <div className="flex">
        {
          quizes.map((quiz, index) => (<Card className="bg-transparent border-none flex items-center" >
            <Card.Body
              className="m-8 bg-blue-100 p-4 ml- rounded-lg h-auto max-h-[calc(1.5rem*9)] overflow-hidden cursor-pointer "
              onClick={() => {
                navigate(`/quiz/${quiz.id}`)
              }}
            >
              <Card.Title>{quiz.subjectName}</Card.Title>
            </Card.Body>
          </Card>))
        }
      </div>
    </div>
  );
};

export default Quiz;
