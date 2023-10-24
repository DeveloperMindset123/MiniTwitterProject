import React from 'react';
import './style.css';
import './sidebar.css';
import './topbar.css';

const Home = () => {
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
          </ul>
          <div className="sign-out">
            <button>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
