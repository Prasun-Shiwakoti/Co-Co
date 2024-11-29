import { useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import Subjects from "./Components/Subjects";
import Notes from "./Components/Notes";
import FlashCards from "./Components/FlashCards";
import Quiz from "./Components/Quiz";
import Login from "./Components/Login";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import PlayQuiz from "./Components/PlayQuiz";
import Charts from "./Components/Charts";
import Flash from "./Components/Flash";
import SubPages from "./Components/SubPages";
import StudyPlanner from "./Components/StudyPlanner";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/flashcards" element={<Flash />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planner" element={<StudyPlanner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id" element={<PlayQuiz />} />
        <Route path="/flashcards/:id" element={<FlashCards />} />
        <Route path="/subjects/:id" element={<SubPages />} />
      </Routes>
    </div>
  );
}

export default App;
