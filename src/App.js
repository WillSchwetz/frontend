/*
 * PROJECT:         SENG3080 - Advanced Web Frameworks
 * FILE:            App.js
 * PROGRAMMER:      William Schwetz
 * FIRST VERSION:   2024-02-16
 * DESCRIPTION:     This app calls reddit api, searches subreddits and lets you save your favourite posts.
 */

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Subcomponent from './subcomponent';
import ErrorModal from './ErrorModal.js';
import PostComponent from './postcomponent';
import { RiEmotionSadLine } from "react-icons/ri";

function App() {
  const [subreddit, setSubreddit] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [subs, setSubs] = useState([]);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [favouriteList, setFavouriteList] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [token, setToken] = useState(process.env.REACT_APP_TOKEN);
  const [updateTokenShow, setUpdateTokenShow] = useState(false);

  // If token needs to be updated, update
  function updateToken(){
    const newToken = document.getElementById("token_box").value.trim();
    setToken(newToken);
    setUpdateTokenShow(false);
  }

  // Default request options for fetch
  var requestOptions = {
    method: 'GET',
    headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
  };

  const getPosts = async () => {
    // Get current list
    const currentList = JSON.parse(localStorage.getItem('subList'));
    if(currentList != null){
      
      try{
        // Call for list of saved posts
        const response = await fetch('https://oauth.reddit.com/by_id/t3_' + currentList.join(",t3_"), requestOptions);
      
        if(response.ok){
          // if response is good, get data
          const responseJson = await response.json();
          const { data: {children} } = responseJson;
          setFavouriteList(children);
        }
        else{
          // Display error modal
          setErrorMessage("Cannot reach Reddit API, please check token")
          setErrorModalShow(true);
        }
      } catch {
        // Display error modal
        setErrorMessage("Subreddit r/" + subreddit + " not found. Check token and try again")
        setErrorModalShow(true);
      }
    } else setFavouriteList([]);
  }

  useEffect(() => {
      // Everytime modalShow or isupdate are changed perform this
      getPosts();
      setIsUpdate(false);
    }, [modalShow, isUpdate] )

  const GetRedditPosts = async (e) => {
    e.preventDefault()
    // If there is nothing in the text box, indicate error
    if(subreddit.length === 0){
      setErrorMessage("Search Box cannot be empty")
      setErrorModalShow(true);
      setSearchError(true)
      return;
    }
    try{
      // Clear error if exists
      setSearchError(false);
      // Call api
      const response = await fetch('https://oauth.reddit.com/r/' + subreddit + '/hot?limit=10', requestOptions);
    
      if(response.ok){
        const responseJson = await response.json();
        const { data: {children} } = responseJson;
        setSubs(children)
        setModalShow(true)
      }
      else{
        // Display error modal
        setErrorMessage("Cannot reach Reddit API, please check token")
        setErrorModalShow(true);
      }
    } catch {
      // Display error modal
      setErrorMessage("Subreddit r/" + subreddit + " not found. Check token and try again")
      setErrorModalShow(true);
    }
  }

  return (
    <div className="App" style={{width: "100%", display: "flex", justifyContent:"center", marginTop:"20px"}}>
      <div className='col-lg-6 col-10 mx-auto shadow p-3 mb-5 bg-white rounded' style={{display:"flex", border:"solid 1px", borderColor:"lightblue", justifyContent:"center", filter: errorModalShow? "blur(5px)" : "none", flexDirection: "column"}}>
        <div style={{display:"flex", justifyContent:"center" }}>
          <div className="mb-5">
            <InputGroup >
              <InputGroup.Text id="basic-addon1">/r</InputGroup.Text>
              <Form.Control
                placeholder="Subreddit"
                aria-label="subreddit"
                aria-describedby="basic-addon1"
                onChange={(e) => setSubreddit(e.target.value)}
                style={{marginRight:"10px", borderColor: searchError ? "red" : ""}}
              />
             
            </InputGroup>
            <Form.Text muted>Name of subreddit to search</Form.Text>
          </div>
          <div>
            <Button type='submit' variant="outline-info"  onClick={(e) => GetRedditPosts(e)}>
            Search
            </Button>
            <Subcomponent
              show={modalShow}
              onHide={() => setModalShow(false)}
              title={subreddit}
              subs={subs}
            />
          </div>
          <div style={{marginLeft:"3px"}}>
            <Button variant="outline-warning"  onClick={() => setUpdateTokenShow(!updateTokenShow)}>
            Update Token
            </Button>
            <Subcomponent
              show={modalShow}
              onHide={() => setModalShow(false)}
              title={subreddit}
              subs={subs}
            />
          </div>
          <div>
            <ErrorModal
              show={errorModalShow}
              onHide={() => setErrorModalShow(false)}
              title={"Error"}
              message={errorMessage}
              backdrop="static"
              style={{borderColor:"red"}}
            />
          </div>
        </div>
        <div style={{display: updateTokenShow ? "block" : "none", marginBottom:"5px"}}>
          <InputGroup>
            <InputGroup.Text>Bearer Token:</InputGroup.Text>
            <Form.Control as="textarea" aria-label="token_box" id="token_box" />
          </InputGroup>
          <Button variant="danger" style={{marginTop:"3px", marginBottom:"10px"}}  onClick={() => updateToken()}>
            Save Token
          </Button>
        </div>
        <div style={{border:"solid 1px"}}>
          <div style={{width:"100%"}}><h3>Favourites:</h3></div>
          {
              favouriteList.length > 0 ?
                favouriteList.map((post) => (!post?.data !== undefined) ? 
                  <PostComponent 
                    post={post} 
                    removeFavourite={true}
                    updateFavs = {() => setIsUpdate(true)}
                    key={post.data.id}
                  /> 
                  : null )
              : (
              <div>
                No Favourites <RiEmotionSadLine/>
              </div>)  
            }
        </div>
      </div>
    </div>
  );
}

export default App;
