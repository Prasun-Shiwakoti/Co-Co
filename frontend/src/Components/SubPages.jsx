import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Modal, Button, Spinner, Alert } from "react-bootstrap";
import NoteCard from "./NoteCard";
import Card from "react-bootstrap/Card";

const SubPages = () => {
  const [note, setNote] = useState([]);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://10.10.11.29:8000/note?id=${id}`, {
        method: "GET",
        headers: { authorization: `token ${token}` },
      });
      const response = await res.json();
      if (response.status) {
        console.log(response);
        setNote(response.data);
        console.log(note);
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError("Error Fetching Notes");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setTimeout(() => setError(""), 3000);
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);

    try {
      const response = await fetch(
        `http://10.10.11.29:8000/llm/pdf_upload/?id=${id}`,
        {
          method: "POST",
          headers: { authorization: `token ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result);
      if (result.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
      } else {
        setError(`${result.message}`);
      }
    } catch (err) {
      setError("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  return (
    <div className="w-[80%] h-screen relative">
      <div className="flex-col flex items-center justify-center">
        <div className="flex-1 flex flex-col p-4 w-[100%]">
          <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
            <FaUser className="text-blue-900 text-2xl ml-4" />
            <h1 className="text-blue-900 text-2xl font-bold ml-2">Topics</h1>
          </div>
        </div>
        <hr className="border-blue-900 w-[95%]" />
      </div>

      <div className="flex flex-wrap justify-start items-start  m-8">
        {/* Note */}
        <div className="my-0">
          <NoteCard subjectName={"Note"} value={note[0]?.content} />
        </div>

        {/* Flashcard */}
        <div
          className="bg-blue-100 p-4 mt-8  rounded-lg cursor-pointer shadow-xl shadow-blue-200 w-[20%] h-auto flex justify-center items-center"
          onClick={() => navigate(`/flashcards/${id}`)}
        >
          <h2 className="text-center text-2xl">Flashcard</h2>
        </div>

        {/* Quiz Card */}
        <div
          className="bg-blue-100 p-4 mt-8 ml-8 rounded-lg cursor-pointer shadow-xl shadow-blue-200 w-[20%] h-auto flex justify-center items-center"
          onClick={() => navigate(`/quiz/${id}`)}
        >
          <h2 className="text-center text-2xl">Quiz</h2>
        </div>

        {/* Add PDF */}
        <div
          className="bg-blue-100 p-4 rounded-lg mt-8 ml-8 cursor-pointer shadow-xl shadow-blue-200 w-[20%] h-auto flex justify-center items-center"
          onClick={() => setModal(true)}
        >
          <h2 className="text-center text-2xl">Add PDF</h2>
        </div>
      </div>

      {modal && (
        <Modal show={modal} onHide={() => setModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload PDF</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select PDF</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
              {loading && <Spinner animation="border" variant="primary" />}
              <Button variant="primary" type="submit" disabled={loading}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default SubPages;
