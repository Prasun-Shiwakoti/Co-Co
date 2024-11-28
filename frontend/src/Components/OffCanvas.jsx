import React, { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Pomodoro from "./Pomodoro";

function RightOffcanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button
        onClick={handleShow}
        className="position-fixed top-1/2 end-0 translate-middle-y border-none w-[15px] rounded-tl-full rounded-bl-full bg-blue-900 h-[15%] p-0"
      ></Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{
          height: "40vh",
          top: "30vh",
        }}
        className="bg-blue-100 rounded-lg"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title
            className="text-blue-900 w-100 text-center mx-auto font-bold"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            Pomodoro
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Pomodoro />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default RightOffcanvas;
