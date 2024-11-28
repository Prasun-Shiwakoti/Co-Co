import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Alert, Card } from "react-bootstrap";

const Subjects = () => {

  const [subjects, setSubjects] = useState([])
  const [formError, setFormError] = useState('')
  const [modal, setModal] = useState(false);
  const [formData, setformData] = useState({ name: "", file: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchSubjects();
  }, [subjects]);

  const handleAddChapter = () => {
    setModal(true);
  };

  // fecth the subjects

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/subjects')
      await res.json().then(response => {
        if (response.ok) {
          setSubjects(response.data);
          setLoading(false)
        }
        else
          setFormError(response.message);
        setLoading(false);
      })

    } catch (err) {
      setError('Error fetching subject')
      setTimeout(() => {
        setError('')
      }, [3000])
      setLoading(false);
    }
  }

  //submit new subject

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (formData.file.length() === 0) {
      setFormError('Please add a file');
      setTimeout(() => {
        setFormError('')
      }, [3000])
      return;
    }

    try {
      const res = await fetch("", {
        method: "POST",
        body: formData
      })
      await res.json().then(response => {
        if (response.ok) {
          fetchSubjects();
        }
      });

    } catch (err) {
      setFormError(err);
    }

  };

  //loader
  return (
    <>
      <div className="w-[80%] h-screen relative">
        <div className="flex-col flex items-center justify-center">
          <div className="flex-1 flex flex-col p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Subject</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
        {
          loading ? (<Spinner variant="primary" className="absolute left-[50%] mt-4" />) : (
            <div>
              {subjects && subjects.map(subject => {
                <Card>
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title className="text-center">Card Title</Card.Title>
                    <Card.Text>
                      Some quick example text to build on the card title and make up the
                      bulk of the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              })}
              <div
                className="m-8 flex justify-start "
              >
                <div className="w-52 h-52 flex items-center justify-center bg-blue-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                  onClick={handleAddChapter}>
                  <div className="text-blue-900 text-4xl ">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {error && (<div className="flex justify-center">
          <Alert variant="danger" className="w-[70%] text-center">{error}</Alert>
        </div>)}

      </div>
      {modal && (
        <Modal
          size="lg"
          show={true}
          onHide={() => setModal(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="flex flex-col justify-center items-center max-h-screen"
        >
          <Modal.Header className="bg-slate-100 flex flex-col justify-center items-center">
            <Modal.Title className="text-blue-900 p-3 text-3xl">
              Add a Subject
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-3 flex flex-col justify-center items-center h-full">
            <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Subject Name"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setformData({ ...formData, [e.target.id]: e.target.value })
                }
                className="p-2 border rounded-lg w-[80%]"
              />

              <div className="w-[80%]">
                <label
                  htmlFor="file"
                  className="block cursor-pointer p-3 border rounded-full text-blue-50 bg-blue-900 hover:text-blue-900 hover:bg-blue-50 text-center"
                >
                  Upload PDF
                </label>
                <input
                  required
                  type="file"
                  id="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      [e.target.id]: Array.from(e.target.files),
                    })
                  }
                  multiple
                  className="hidden"
                />
              </div>

              <button
                type="submit"

                className="px-4 py-2 rounded-full text-blue-50 bg-green-700 hover:text-green-700 hover:bg-white transition-colors w-[30%] h-14"
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
          {formError && (<Alert variant="danger">{formError}</Alert>)}
        </Modal>
      )}
    </>
  );
};

export default Subjects;
