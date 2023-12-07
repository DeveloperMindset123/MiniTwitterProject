/* eslint-disable no-unused-vars */
//AppRouter.js
import {React, useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import Upload from './Upload';
import User from './User';
import Auth from './components/Auth';
import Payment from './Payment';
import Cookies from 'js-cookie'; // or use document.cookie
import axios from 'axios';

const App = () => {
  // fetch user session
  const [user, setUser] = useState('');  //if I set this to null the page will just continue to load
  useEffect(() => {
    const validateSession = async () => {
      const sessionCookie = Cookies.get('username');

      console.log(!sessionCookie ===undefined || !sessionCookie == '' ? 'No session cookie found.' : `Session cookie: ${sessionCookie}`);

      if (sessionCookie) {
        try {
          // Fetch user data after setting the session cookie
          const response = await axios.get('http://localhost:4000/api/fetch-user', {
            params:{'userId': sessionCookie},
            withCredentials: true,  //added this line
          });
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
    return (
      <BrowserRouter>
      {
        user !== null ? (
        <Routes> 
              <Route path='/' element={<Home userId={user._id}/>} />
              <Route path='/Landing' element={<Landing userId={user._id}/>} />
              <Route path='/Upload' element={<Upload userId={user._id}/>} />
              <Route path='/User' element={<User userId={user._id}/>} />
              <Route path='/Auth' element={<Auth userId={user._id}/>} /> 
              <Route path='/Payment' element={<Payment userId={user._id}/>} />
        </Routes>
        ) : (
          //Render a laoding indicator
          <div>Loading...</div>
        )
      } 
      </BrowserRouter>
    );
};

export default App;