import React from 'react';
import './style.css'; 

const Home = () => {
  return (
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
      </div>
      <div className="content">
        <h1>Home</h1>
      </div>
      <div className="button-container">
        <button className="main-button">Main</button>
        <button className="trending-button">Trending</button>
      </div>
    </div>
  );
}

export default Home;
