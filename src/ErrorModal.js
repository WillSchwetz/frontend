/*
 * PROJECT:         SENG3080 - Advanced Web Frameworks
 * FILE:            ErrorModal.js
 * PROGRAMMER:      William Schwetz
 * FIRST VERSION:   2024-02-16
 * DESCRIPTION:     This file holds the component for displaying errors
 */

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ErrorModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      
    >
      <div style={{border:"solid 2px red"}}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {props.message}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}