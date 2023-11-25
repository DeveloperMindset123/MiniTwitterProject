/* eslint-disable no-unused-vars */
//AppRouter.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import Upload from './Upload';
import User from './User';
import Auth from './components/Auth';
//import { AnimatePresence } from 'framer-motion'; --> we can use this for remodeling our UI components later, if we have time, we will not worry about this atm


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
              <Route path='/Auth' element={<Auth/>} />  {/**We want to ensure that when user clicks on the sign up or login button, user  */}
        </Routes>
      </BrowserRouter>
    );
};

export default App;