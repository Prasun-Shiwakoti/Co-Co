import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { HiMenuAlt2 } from "react-icons/hi";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [formError, setFormError] = useState("");
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch the subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/subject/", {
        method: "GET",
        headers: { authorization: `token ${token}` },
      });
      const response = await res.json();
      if (response.status) {
        setSubjects(response.data);
        setLoading(false);
      } else {
        setFormError(response.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Error fetching subject");
      setTimeout(() => {
        setError("");
      }, 3000);
      setLoading(false);
    }
  };

  // Submit new subject
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/subject/", {
        method: "POST",
        headers: {
          authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const response = await res.json();
      if (response.status) {
        setModal(false);
        fetchSubjects();
      } else {
        setFormError(response.message);
      }
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <div className="w-[80%] h-screen relative">
        <div className="flex-col flex items-center justify-center">
          <div className="flex-1 flex flex-col p-4 w-[100%]">
            <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <HiMenuAlt2 className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Topics</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%]" />
        </div>

        {loading ? (
          <Spinner variant="primary" className="absolute left-[50%] mt-4" />
        ) : (
          <div className="flex gap-4 flex-wrap">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="m-8 flex justify-start w-[20vw] cursor-pointer shadow-xl shadow-blue-200 h-[10vh]"
              >
                <div
                  className="flex justify-center items-center bg-blue-100 p-4 rounded-md w-full h-full cursor-pointer"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  <div className="text-blue-900 text-4xl text-center">
                    {subject.name}
                  </div>
                </div>
              </div>
            ))}

            {/* "+" button to add a subject */}
            <div className="m-8 flex justify-start w-[20vw] cursor-pointer shadow-xl shadow-blue-200 h-[10vh]">
              <div
                className="flex justify-center items-center bg-blue-100 p-4 rounded-md w-full h-full cursor-pointer"
                onClick={() => setModal(true)}
              >
                <div className="text-blue-900 text-4xl flex justify-center items-center text-center h-full w-full">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <Alert variant="danger" className="max-w-[50%] text-center">
              {error}
            </Alert>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          size="md"
          show={true}
          onHide={() => setModal(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="flex flex-col justify-center items-center max-h-screen"
        >
          <Modal.Header className="bg-blue-100 flex flex-col justify-center items-center">
            <Modal.Title className="text-blue-900 p-3 text-3xl">
              Add a Subject
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-3 flex flex-col justify-center items-center h-full bg-blue-50">
            <form
              className="flex flex-col items-center gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                required
                placeholder="Subject Name"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.id]: e.target.value })
                }
                className="p-3 border border-slate-400 rounded-full w-[70%] bg-transparent shadow-2xl"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded-full text-blue-50 bg-green-700 hover:text-green-700 hover:bg-white transition-colors w-[70%] h-14"
              >
                Submit
              </button>
            </form>
          </Modal.Body>

          <Modal.Footer className="bg-slate-100 flex justify-end pr-10">
            <Button
              className="rounded-full border-none text-blue-50 bg-slate-400 hover:text-slate-400 hover:bg-blue-50"
              onClick={() => setModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
          {formError && <Alert variant="danger">{formError}</Alert>}
        </Modal>
      )}
    </>
  );
};

export default Subjects;
