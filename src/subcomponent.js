/*
 * PROJECT:         SENG3080 - Advanced Web Frameworks
 * FILE:            subcomponent.js
 * PROGRAMMER:      William Schwetz
 * FIRST VERSION:   2024-02-16
 * DESCRIPTION:     This file holds the component that displays a modal of posts
 */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import PostComponent from './postcomponent';

function Subcomponent(props) {

  return (
    <Modal
    {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {"r/ " + props.title}
          <span style={{color:"red", fontSize:"14px", marginLeft: "10px"}}>TOP 10</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{overflowY: 'auto', maxHeight:"500px"}}>
          {
            props.subs.map((post) => (!post?.data !== undefined) ? 
              <PostComponent 
                post={post} 
                addFavourite={true}
                key={post.data.id}
              /> 
              : null )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

 export default Subcomponent;