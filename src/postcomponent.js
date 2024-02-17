/*
 * PROJECT:         SENG3080 - Advanced Web Frameworks
 * FILE:            postcomponent.js
 * PROGRAMMER:      William Schwetz
 * FIRST VERSION:   2024-02-16
 * DESCRIPTION:     This file holds the component that displays individual posts
 */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaHeartCirclePlus } from "react-icons/fa6";
import { FaHeartCircleMinus } from "react-icons/fa6";

function PostComponent(props) {

    const { post: {data} } = props;
    const [buttonPressed, setButtonPressed] = useState(false);

    // Deal with adding a favourite
    const handleAddFavourite = (postID) => {
        setButtonPressed(true);
        if(postID != null){
            const tmpList = [];
            // Get current list
            const currentList = JSON.parse(localStorage.getItem('subList'));
            if(currentList != null){
                tmpList.push(...currentList);
            }
            if(tmpList.indexOf(postID) === -1) {
                tmpList.push(postID);
                // Save updated list
                localStorage.setItem('subList', JSON.stringify(tmpList));
            }
        }
    }

    const handleRemoveFavourite = (postID) => {
        // Get current list
        let currentList = JSON.parse(localStorage.getItem('subList'));
        if(currentList != null){
            const index = currentList.indexOf(postID);
            if(currentList.length > 1){
                if(index !== -1) currentList.splice(index, 1);
                // Update list
                localStorage.setItem('subList', JSON.stringify(currentList));
            } else {
                if(index !== -1) localStorage.clear();
            }
        }
        props.updateFavs();
    }

    return (
        <Card className='mx-1' style={{ marginBottom:"10px" }}>
        <Card.Body>
            <Card.Title>{data.title}</Card.Title>
            <Card.Text style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                <div>Score: {data.score}</div>
                <div><a href={"https://www.reddit.com" + data.permalink} target="_blank" rel="noopener noreferrer"> Comments </a></div>
            </Card.Text>
            <div style={{width: "100%", display:"flex", justifyContent:"end"}}>
                {
                    props.addFavourite ?
                        <Button 
                            variant="outline-danger" 
                            onClick={() => handleAddFavourite(data.id)}
                            disabled = {buttonPressed}
                            >
                            Favourite <FaHeartCirclePlus />
                        </Button>
                        : null
                }
                {
                    props.removeFavourite ?
                        <Button 
                            variant="outline-danger" 
                            onClick={() => handleRemoveFavourite(data.id)}
                            disabled = {buttonPressed}
                            >
                            Remove <FaHeartCircleMinus />
                        </Button>
                        : null
                }
            </div>
        </Card.Body>
        </Card>
    );
}

export default PostComponent;
