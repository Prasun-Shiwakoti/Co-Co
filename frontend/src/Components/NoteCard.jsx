import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const NoteCard = (props) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div>
        <Card style={{ width: "18rem" }} className="bg-transparent border-none">
          <Card.Body
            className="m-8 bg-blue-100 p-4 ml- rounded-lg h-auto max-h-[calc(1.5rem*9)] overflow-hidden cursor-pointer "
            onClick={() => {
              setModal(true);
            }}
          >
            <Card.Title className="text-center">{props.subjectName}</Card.Title>
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
          <Modal.Header className="bg-slate-100 flex flex-col justify-center items-center">
            <Modal.Title className="text-blue-900 p-3 text-3xl w-full text-center">
              <p className="truncate w-4/5">{props.value}</p>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-3 flex flex-col justify-center items-center h-full">
            <p className="text-blue-900">{props.value}</p>
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

export default NoteCard;
