import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { TbNotes } from "react-icons/tb";
import NoteCard from "./NoteCard";

const Notes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notesList, setNotesList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotesList();
  }, []);

  const fetchNotesList = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/note/", {
        method: "GET",
        headers: { authorization: `token ${token}` },
      });
      const response = await res.json();

      if (response.status) {
        setNotesList(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        setError(response.message);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Error Fetching Notes");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="w-[80%] mx-auto overflow-hidden">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className="p-4 w-[100%]">
            <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh] mx-auto">
              <TbNotes className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Notes</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%]" />
        </div>
      </div>
      {loading ? (
        <Spinner variant="primary" className="absolute left-[50%] mt-4" />
      ) : (
        <div className="flex flex-wrap justify-start gap-4 mt-4">
          {notesList.length === 0 ? (
            <div>
              <h1 className="m-8 text-2xl text-center text-gray-600">
                No Notes Found
              </h1>
            </div>
          ) : (
            notesList?.map((note) => (
              <NoteCard
                key={note.id} // Ensure every mapped component has a unique key
                value={note.content}
                subjectName={note.subject.name}
                className="w-full md:w-1/3 p-4"
              />
            ))
          )}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
