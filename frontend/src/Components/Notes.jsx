import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import NoteCard from "./NoteCard";
import { Spinner } from "react-bootstrap";


const Notes = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notesList, setNotesList] = useState([]);
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchNotesList();
  }, [])

  const fetchNotesList = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://10.10.11.29:8000/note/', {
        method: 'GET',
        headers: { "authorization": `token ${token}` }
      })
      const response = await res.json();

      if (response.status) {
        console.log(response)
        setNotesList(response.data);
        setLoading(false);
      }
      else {
        setLoading(false);
        setError(response.message);
        setTimeout(() => setError(''), [3000])
      }
    }
    catch (err) {
      setError('Error Fetching Notes');
      setTimeout(() => setError(''), [3000])
    }
  }

  return (
    <div className="w-[80%] overflow-hidden">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className="p-4 w-[100%]">
            <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Notes</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%]" />
        </div>
      </div>
      {
        loading ? (<Spinner variant="primary" className="absolute left-[50%] mt-4" />) : (<div className="flex">
          {notesList.length === 0 ? (<div>
            <h1 className="m-8 text-2xl text-center text-gray-600">No Notes Found</h1>
          </div>) :
            notesList?.map((note) => {
              return (
                <NoteCard
                  value={
                    note.content
                  }
                  subjectName={note.subject.name}
                />
              )
            })
          }
        </div>)
      }

    </div>
  );
};

export default Notes;
