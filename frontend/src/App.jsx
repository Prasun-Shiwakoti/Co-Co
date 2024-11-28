import { useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import Subjects from "./components/Subjects";
import Notes from "./components/Notes";
import FlashCards from "./components/FlashCards";
import Quiz from "./components/Quiz";
import Login from "./components/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
