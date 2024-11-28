import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import NoteCard from "./NoteCard";

const Notes = () => {

  const [notesList, setNotesList] = useState([{ subject: 'Science', text: 'sdsahjdgsajkdask' }, { subject: 'Maths', text: 'asdasdsadsa' }]);

  return (
    <div className="w-[80%] overflow-hidden">
      {/* Prevent scrolling on the main div */}
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
      <div className="flex">
        {
          notesList.map((note) => {
            return (
              <NoteCard
                value={
                  note.text
                }
                subjectName={note.subject}
              />
            )
          })
        }

      </div>
    </div>
  );
};

export default Notes;
