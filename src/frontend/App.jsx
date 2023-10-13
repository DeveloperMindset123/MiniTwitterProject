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
          {/**Note: had to specify MiniTwitterProject/component name */}
            <Route path='/MiniTwitterProject/Home' element={<Home />} />
            <Route path='/MiniTwitterProject/Landing' element={<Landing />} />
            <Route path='/MiniTwitterProject/Upload' element={<Upload />} />
            <Route path='/MiniTwitterProject/User' element={<User />} />
        </Routes>
      </BrowserRouter>
    );
};

export default App;