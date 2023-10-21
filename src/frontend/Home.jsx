import React from 'react';
import './style.css'; 
import Registration from './components/registration';
import Login from './components/login';
import "bootstrap/dist/css/bootstrap.min.css";

//this will serve as our App.jsx file

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1>Home</h1>
      </div>
      <div>
        <Login />
        <Registration />
      </div>
      <div className="button-container">
        <button className="main-button">Main</button>
        <button className="trending-button">Trending</button>
      </div>
    </div>
  );
}

export default Home;
