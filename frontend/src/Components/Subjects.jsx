import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
// import upload from "../images/Group 1.png";

const Subjects = () => {
  const handleAddChapter = () => {
    setModal(true);
  };
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({ name: "", file: null });
  const handleSubmit = async () => {
    console.log(data);
    if (data.name && data.file) {
      console.log("ok");
    } else {
      setFormError(true);
      setTimeout(() => {
        setFormError(false);
      }, 3000);
    }
  };
  return (
    <>
      <div className="w-[80%] h-screen ">
        <div className="flex-col flex items-center justify-center">
          <div className="flex-1 flex flex-col p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Subject</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>

        <div
          className="m-8 flex justify-start cursor-pointer"
          onClick={handleAddChapter}
        >
          <div className="w-52 h-52 flex items-center justify-center bg-blue-100 rounded-lg shadow-md hover:shadow-lg">
            <div className="text-blue-900 text-4xl ">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                +
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <Modal
          size="lg"
          show={true}
          onHide={() => setModal(false)}
          // dialogClassName="w-[100%] h-[100vh]"
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
            <form className="flex flex-col items-center gap-4 w-full">
              <input
                type="text"
                placeholder="Subject Name"
                id="name"
                value={data.name}
                onChange={(e) =>
                  setData({ ...data, [e.target.id]: e.target.value })
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
                  type="file"
                  id="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setData({
                      ...data,
                      [e.target.id]: Array.from(e.target.files),
                    })
                  }
                  multiple
                  className="hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
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
        </Modal>
      )}
    </>
  );
};

export default Subjects;
