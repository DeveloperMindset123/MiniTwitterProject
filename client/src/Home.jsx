/* eslint-disable no-unused-vars */
import {React, useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../src/styles/style.css';
import '../src/styles/sidebar.css';
import '../src/styles/topbar.css';

function FetchPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:4000/api/fetch-posts', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setPosts(data);
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchData();
  }, []); // The empty dependency array ensures this runs once when the component mounts  
  return (
    <div className="container">
      <h1>Posts</h1>
      <div className="row">
        {posts.map((post, index) => (
          <div className="col-md-4" key={index}>
            <div className="card">
              <div className="card-body">
                <p><i>User ID: {post.userId}</i></p>
                <h5 className="card-title">{post.bodyText}</h5>
                <p className="card-text">Hashtags: {post.hashTags}</p>
                <p className='timestamp'>{post.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Home = () => {
 
  const handleLogout = async () => {  //this function will handle logout
    try {
        const response = await axios.get("http://localhost:4000/auth/logout");
        console.log(response.data);
        navigate("/Landing"); //navigate the user back to the Landing page
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

  //define the path to redirect user back to landing page upon logging out
  let navigate = useNavigate();
  const routeChange = () => {  
    //here, we will implement the logic to redirect user back to the login page
    let path = '/Landing';  //this will redirect user back to the landing page, backend functionalities hasn't been fully implemented yet
    navigate(path); //redirect the user to the path specified
  }

  return (
    <div>
      <div className="top-bar">
        <div className="slogan">Connect More</div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
      
      <div className="home-container">
        <Row>
          <Col lg={2}> {/* Sidebar */}
            <div className="sidebar">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Notifications</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Bookmarks</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Lists</a></li>
                <li><a href="#">More</a></li>
                <li><a href='./upload'>Upload</a></li>
              </ul>
              <div className="sign-out">
                <button onClick={routeChange}>Sign Out</button> {/**We will need to ensure that user gets logged out when this button is clicked, this is a placeholder for now*/}
              </div>
            </div>
          </Col>
          <Col lg={7}> {/* Content */}
            <FetchPosts />
          </Col>
          <Col lg={3}> {/* Messages Section */}
            <div className="messages-section">
              <h2>Messages</h2>
              <div className="chat-box">
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                <div className="chat-message">Name</div>
                {/* Add more chat messages here */}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}


export default Home;
