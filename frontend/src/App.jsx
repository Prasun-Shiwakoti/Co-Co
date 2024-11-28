import { useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Subjects from "./Components/Subjects";
import Notes from "./Components/Notes";
import FlashCards from "./Components/FlashCards";
import Quiz from "./Components/Quiz";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;
