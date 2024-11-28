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

function App() {

  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
