/* eslint-disable no-unused-vars */
//AppRouter.js
import {React, useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import Upload from './Upload';
import User from './User';
import Auth from './components/Auth';
//import { AnimatePresence } from 'framer-motion'; --> we can use this for remodeling our UI components later, if we have time, we will not worry about this atm
import Cookies from 'js-cookie'; // or use document.cookie
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState('');
  // console.log(Cookies.get())

  useEffect(() => {
    const validateSession = async () => {
      const sessionCookie = Cookies.get('username');

      console.log(!sessionCookie ? 'No session cookie found.' : `Session cookie: ${sessionCookie}`);

      if (sessionCookie) {
        try {
          // console.log(sessionCookie);
          const response = await axios.get('http://localhost:4000/api/fetch-user', {
            params:{'userId': sessionCookie}
          });
          // console.log('user:', response.data);
          setUser(response.data);
        } 
        catch (error) {
          console.error('Error validating session:', error);
        }
      }
  };
    validateSession();
  }, []);
  console.log('User:',user);
// add 'user' object to input param to landing
    return (
      <BrowserRouter>
        <Routes> 
              <Route path='/' element={<Home userId={user._id}/>} />
              <Route path='/Landing' element={<Landing userId={user._id}/>} />
              <Route path='/Upload' element={<Upload userId={user._id}/>} />
              <Route path='/User' element={<User userId={user._id}/>} />
              <Route path='/Auth' element={<Auth userId={user._id}/>} />  {/**We want to ensure that when user clicks on the sign up or login button, user  */}
        </Routes>
      </BrowserRouter>
    );
};

export default App;