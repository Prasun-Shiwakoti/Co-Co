import React, { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function RightOffcanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {/* Button to trigger the Offcanvas */}
      <Button
        onClick={handleShow}
        className="position-fixed top-1/2 end-0 translate-middle-y border-none w-[15px] rounded-tl-full rounded-bl-full bg-blue-900 h-[15%] p-0"
      ></Button>

      {/* Offcanvas component that slides from the right */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{
          height: "60vh", // Set height to 60% of the viewport height
          top: "20vh", // Vertically center it
        }}
        className="bg-blue-100 rounded-lg" // Tailwind for background and rounded borders
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas from Right</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>This is an offcanvas sliding from the right side of the screen.</p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default RightOffcanvas;
