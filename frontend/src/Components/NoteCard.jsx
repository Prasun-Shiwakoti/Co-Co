import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const NoteCard = (props) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div>
        <Card
          style={{ width: "18rem" }}
          className="bg-transparent border-none "
        >
          <Card.Body
            className="m-8 bg-blue-100 p-4  rounded-lg h-auto  cursor-pointer shadow-xl shadow-blue-200 "
            onClick={() => {
              setModal(true);
            }}
          >
            <Card.Title className="text-center text-2xl ">
              {props.subjectName}
            </Card.Title>
          </Card.Body>
        </Card>
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
          <Modal.Header className="bg-blue-100  flex flex-col text-center justify-center items-center">
            <Modal.Title className="text-blue-900 p-3 text-3xl w-full flex justify-center text-center">
              <p className="truncate w-4/5">{props.value}</p>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4 flex flex-col justify-center items-center h-full bg-blue-50">
            <p className="text-blue-900">{props.value}</p>
          </Modal.Body>

          <Modal.Footer className="bg-blue-100 flex justify-end pr-10">
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

export default NoteCard;
