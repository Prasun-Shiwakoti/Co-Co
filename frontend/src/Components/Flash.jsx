import React, { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Flash = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flashCards, setFlashCards] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFlashCards();
  }, []);

  const fetchFlashCards = async () => {
    try {
      const res = await fetch("http://10.10.11.29:8000/flashcard/", {
        method: "GET",
        headers: {
          authorization: `token ${token}`,
        },
      });
      const response = await res.json();
      if (response.status) {
        console.log("fetch");
        console.log(response);
        setFlashCards(response.data);
        setLoading(false);
        setError("");
      } else {
        setLoading(false);
        setError(response.message);
        setTimeout(() => setError(""), [3000]);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Error fetching Flashcards");
      setTimeout(() => setError(""), [3000]);
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
                Flashcards
              </h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex">
          {flashCards.map((flashcard, index) => (
            <Card className="bg-transparent border-none flex items-center">
              <Card.Body
                className="m-8 bg-blue-100 p-4 ml- rounded-lg h-auto max-h-[calc(1.5rem*9)] overflow-hidden   cursor-pointer shadow-xl shadow-blue-200"
                onClick={() => {
                  navigate(`/flashcards/${flashcard.id}`);
                }}
              >
                {console.log(flashcard)}
                <Card.Title>{flashcard.subject.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Flash;
