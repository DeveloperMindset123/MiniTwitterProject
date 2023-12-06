/* eslint-disable no-unused-vars */
import {React, useState, useEffect} from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../src/styles/style.css';
import '../src/styles/sidebar.css';
import Upload from './Upload.jsx';
import UploadPop_up from "./UploadPop_up.jsx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faPen,faTrashAlt, faFlag, 
  faEye, faHome, faBell, faUsers, faBookmark, faUser, faCog, faList, faEllipsisH, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../src/styles/Home.css';
import moment from 'moment-timezone';

function setCookie(name, value, daysToExpire) {
  var date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + ";path=/";
}
function deleteCookie(name) { setCookie(name, "", -1); }

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
  const apiUrl = 'http://localhost:4000/api/update-post-counter';
  const fullUrl = `${apiUrl}/${encodeURIComponent(postId)}/${encodeURIComponent(type)}`;

  try {
    const response = await axios.post(fullUrl);
    console.log('Post counter updated successfully!', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating post counter:', error.response ? error.response.data : error.message);
    throw error;
  }
}
function FetchPosts(type) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:4000/api/fetch-${type.type}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data
          data.reverse()
          setPosts(data)
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
  }, [posts]);
  // Conditional rendering based on loading state
  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      
    <div className="container" style={{ marginTop:"-20px"}}>
      <div className="row">
        {posts.map((post, index) => (
          <div className="post-container " key={index}>
            <div className="card">
              <div className="card-body">
                <FontAwesomeIcon icon={faUser} className="avatar-icon" /> User ID: {post.userId}
                <h5 className="card-title">{post.bodyText}</h5>
                <div className="post-image">
                {post.imageId && <img src="" alt="Image"/>}
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
                <p className='timestamp'>{moment(post.time).format('MMMM Do YYYY, h:mm:ss a')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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
      });

      if (response.status === 201) {
        const responseData = response.data;
        console.log(responseData);
        if (responseData && responseData.response) {
          const updatedConversation = [
            ...conversation,
            { user: userInput, ai: responseData.response },
          ];
          setConversation(updatedConversation);
        } else {
          console.error('Unexpected response format:', responseData);
        }
      } else {
        console.error('Unexpected status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setUserInput(''); // Clear input field after submission
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent form submission causing a page reload
    if (userInput.trim() !== '') {
      handleSubmit();
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit} className="input-form">
        <input type="text" value={userInput} onChange={handleInputChange} placeholder="Type your message here" className="input-box" />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
      <div className="conversation-container">
        {conversation.slice(0).reverse().map((entry, index) => ( // Reversed the conversation array
          <div key={index} className="message">
            <p className="user-message"><strong>You:</strong> {entry.user}</p>
            <p className="ai-message"><strong>Elon:</strong> {entry.ai}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const Home = ({userId}) => {
  const handleLogout = async () => {
    try {
        deleteCookie("username");
        navigate("/landing");
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
  const [showUpload, setShowUpload] = useState(false)
  const [selectedTab, setSelectedTab] = useState('posts'); // State to manage selected tab
  const handleForYouClick = () => {
    setSelectedTab('posts'); // Update the selected tab to 'posts'
  };
  const handleTrendingClick = () => {
    setSelectedTab('trendy'); // Update the selected tab to 'trendy'
  };
  return (
    <div> 
      <div className="home-container">
        {/* Trending bar */}
        <Row className='trending-tab'> 
          <Col className='trending-col'>
              <button className='trending-item' onClick={handleForYouClick}>
                For you
              </button>
              <button className='trending-item ' onClick={handleTrendingClick}>
                Trending
              </button>
          </Col>
        </Row> 
        <Row>
          <Col lg={2}> {/* Sidebar */}
            <div className="sidebar">
              <ul>
              <div className="slogan"><img className = 'logo'src="/logo.jpeg" alt="Log" /></div>
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
                <button onClick={handleLogout}>Sign Out</button> {/**We will need to ensure that user gets logged out when this button is clicked, this is a placeholder for now*/}
               {/*} <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> <button>Sign Out</button> */}
              </div>
            </div>
          </Col>
          <Col lg={7}> {/* Content */}
            <Upload userId={userId}/>
            <FetchPosts type={'posts'} />
            {/* <FetchPosts /> */}
            {selectedTab === 'posts' && <FetchPosts className="posts" type={'posts'} />}
            {selectedTab === 'trendy' && <FetchPosts className="trendy" type={'trendy'} />} 
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

