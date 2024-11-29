import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import NoteCard from "./NoteCard";
import Card from "react-bootstrap/Card";

const SubPages = () => {
  const [note, setNote] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/notes/${id}`, {
        method: "GET",
        headers: { "authorization": `token ${token}` }
      })
      const response = await res.json();
      if (response.status) {
        console.log(response);
        setNote(response.data);
        setLoading(false);
      } else {
        setError(response.message)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)

      setError('Error Fetching Notes');
    }
  }


  return (
    <div className="w-[80%] h-screen relative">
      <div className="flex-col flex items-center justify-center">
        <div className="flex-1 flex flex-col p-4 w-[100%]">
          <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
            <FaUser className="text-blue-900 text-2xl ml-4" />
            <h1 className="text-blue-900 text-2xl font-bold ml-2">Notes</h1>
          </div>
        </div>
        <hr className="border-blue-900 w-[95%] " />
      </div>
      <div className="flex justify-between items-start">
        <div className="m-8 flex-row flex gap-5 w-[100%]">

          {/* Note */}

          <NoteCard subjectName={'Note'} value />

          {/* Flashcard */}
          <Card style={{ width: "18rem" }} className="border-none">
            <Card.Body className="m-8 bg-blue-100 p-4 rounded-lg h-auto cursor-pointer shadow-xl shadow-blue-200">
              <Card.Title className="text-center text-2xl">
                Flashcard
              </Card.Title>
            </Card.Body>
          </Card>

          {/* Quiz Card */}
          <Card style={{ width: "18rem" }} className="border-none">
            <Card.Body className="m-8 bg-blue-100 p-4 rounded-lg h-auto cursor-pointer shadow-xl shadow-blue-200">
              <Card.Title className="text-center text-2xl">Quiz</Card.Title>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubPages;
