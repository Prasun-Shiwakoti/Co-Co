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
          height: "60vh",
          top: "20vh",
        }}
        className="bg-blue-100 rounded-lg"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas from Right</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Pomodoro />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default RightOffcanvas;
