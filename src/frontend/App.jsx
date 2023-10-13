/* eslint-disable no-unused-vars */
//AppRouter.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import Upload from './Upload';
import User from './User';

const App = () => {

    //simulate userlogin status (replace later with actual logic)
    const isUserLoggedIn = true;

    return (
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Landing' element={<Landing />} />
            <Route path='/Upload' element={<Upload />} />
            <Route path='/User' element={<User />} />
        </Routes>
      </BrowserRouter>
    );
};

export default App;