import {React, useState, useEffect} from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import '../src/styles/style.css';
import '../src/styles/sidebar.css';
import Upload from './Upload.jsx';
import UploadPop_up from "./UploadPop_up.jsx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUsers, faBookmark, faUser, faCog, faList, faEllipsisH, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../src/styles/Home.css';

async function Delete(_id) {
  const isConfirmed = window.confirm('Are you want to Delete this Post?');
  if (isConfirmed) {
    try {
      const response = await axios.delete(`http://localhost:4000/api/delete-post/${_id}`);

      if (response.status === 200) {
        alert('Post deleted successfully');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert('Failed to delete post: ' + error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  } else {
    console.log('Post deletion cancelled by user.');
  }
}
async function UpdatePostCounter(postId, type){
  const apiUrl = 'http://localhost:4000/api/update-post-counter'; // Replace with your actual server URL
  const fullUrl = `${apiUrl}/${encodeURIComponent(postId)}/${encodeURIComponent(type)}`;

  try {
    const response = await axios.post(fullUrl);
    console.log('Post counter updated successfully!', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating post counter:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
function FetchPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:4000/api/fetch-posts', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setPosts(response.data);
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }

    fetchData();
  }, []); // The empty dependency array ensures this runs once when the component mounts

  // Conditional rendering based on loading state
  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
    <div className="container">
      <div className="row">
        {posts.map((post, index) => (
          <div className="post-container " key={index}>
            <div className="card">
              <div className="card-body">
                <FontAwesomeIcon icon={faUser} className="avatar-icon" /> User ID: {post.userId}
                <h5 className="card-title">{post.bodyText}</h5>
                <div className="post-image">
                <img src="" alt="Image"/>
              </div>
                <p className="card-text">{post.hashTags}</p>
                <Row>
                  <Col xl='10'> {/* Likes, Posts, Reviews, Comments */}
                    <button className="like" onClick={() => UpdatePostCounter(post._id, 'like')}><FontAwesomeIcon icon={faThumbsUp} />{post.likes}</button>&nbsp;&nbsp;
                    <button className="dislike" onClick={() => UpdatePostCounter(post._id, 'dislike')}><FontAwesomeIcon icon={faThumbsDown} />{post.dislikes}</button>&nbsp;&nbsp;
                    <button className="comment" onClick={() => UpdatePostCounter(post._id, 'comment')}><FontAwesomeIcon icon={faComment} />{post.comments}</button>&nbsp;&nbsp;
                    <button className="report" onClick={() => UpdatePostCounter(post._id, 'report')}> <FontAwesomeIcon icon={faFlag} />{post.reports}</button> &nbsp;&nbsp;
                    <button className="view" onClick ={() => UpdatePostCounter(post._id, 'view')}><FontAwesomeIcon icon={faEye} />{post.views}</button>
                  </Col>
                  <Col> {/* Delete and Edit */}
                    <button className="edit" onClick={() => Delete(post._id)}> <FontAwesomeIcon icon={faPen}/></button>
                    <button className="delete" onClick={() => Delete(post._id)}> <FontAwesomeIcon icon={faTrashAlt} /></button> 
                    {/* add condition to only allow user who posted and SU to change */}
                  </Col>
                </Row>
                <p className='timestamp'>{post.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
}
function Trending(){
  //
  return null;
}
function ElonGPT() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/askGPT', {
        input: userInput,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setConversation([...conversation, { user: userInput, ai: response.data }]);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
      setUserInput(''); // Clear input field after submission
    }
  };

  return (
    <div className="container">
      <div className="input-form">
        <input type="text" value={userInput} onChange={handleInputChange} placeholder="Type your message here" />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
      <div className="conversation">
        {conversation.map((entry, index) => (
          <div key={index}>
            <p><strong>You:</strong> {entry.user}</p>
            <p><strong>AI:</strong> {entry.ai}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
const Home = () => {
  const [showUpload, setShowUpload] = useState(false)
  return (
    <div> 
      <div className="home-container">
        <Row>
          <Col lg={2}> {/* Sidebar */}
            <div className="sidebar">
              <ul>
              <div className="slogan">Connect More</div>
                <li><a href="#"><FontAwesomeIcon icon={faHome} className="icon" /> Home</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faBell} className="icon" /> Notifications</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faUsers} className="icon" /> Community</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faBookmark} className="icon" /> Bookmarks</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faUser} className="icon" /> Profile</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faCog} className="icon" /> Settings</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faList} className="icon" /> Lists</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faEllipsisH} className="icon" /> More</a></li>
                <li><Button onClick={() => setShowUpload(!showUpload)} variant="dark" className="btn-lg">
                  <FontAwesomeIcon icon={faPlus} className="icon" />
                   New Post
                   </Button>
                   {showUpload &&(
                    <UploadPop_up
                      setShowUpload ={setShowUpload}
                      showUpload ={showUpload}/>
                   )}
                   </li> 
                
              </ul>
              <div className="sign-out">
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> <button>Sign Out</button>
              </div>
            </div>
          </Col>
          <Col lg={7}> {/* Content */}
                   <Upload/>
            <FetchPosts/>
            {/* <FetchPosts /> */}
          </Col>
          <Col lg={3}> {/* AI Chat Bot */}
            <div className="chat-bot">
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
              </div>
              <h2>Talk to Elon!</h2>
              <ElonGPT/>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default Home;
