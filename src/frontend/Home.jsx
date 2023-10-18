import React from 'react';
import './style.css'; 

const Home = () => {
  return (
    <div className="home-container">
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
