import {React, useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../src/styles/style.css';
import '../src/styles/sidebar.css';
import Upload from './Upload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUsers, faBookmark, faUser, faCog, faList, faEllipsisH, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


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
      <div className="row">
        {posts.map((post, index) => (
          <div className="col-md-4" key={index}>
            <div className="card">
              <div className="card-body">
                <p><i>User ID: {post.userId}</i></p>
                <h5 className="card-title">{post.bodyText}</h5>
                <p className="card-text">Hashtags: {post.hashTags}</p>
                <p className='timestamp'>{post.time}</p>
                <p className='likes, posts, reviews'>Likes:{post.likes} Reports:{post.reports} Views:{post.views}</p>
                <button className="delete" onClick={() => Delete(post._id)}>Delete</button> {/* add condition to only allow user who posted and SU to change */}
                <button className="report" onClick={() => UpdatePostCounter(post._id, 'report')}>Report</button>
                <button className="like" onClick={() => UpdatePostCounter(post._id, 'like')}>Like</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Home = () => {
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
                <li><a href='./upload'><FontAwesomeIcon icon={faPlus} className="icon" /> New Post</a></li> 
                
              </ul>
              <div className="sign-out">
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> <button>Sign Out</button>
              </div>
            </div>
          </Col>
          <Col lg={7}> {/* Content */}
            <Upload></Upload>
            <FetchPosts />
          </Col>
          <Col lg={3}> {/* AI Chat Bot */}
            <div className="chat-bot">
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
              </div>
              <h2>AI Chat Bot</h2>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}


export default Home;
