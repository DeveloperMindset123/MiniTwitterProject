/* eslint-disable no-unused-vars */
//AppRouter.js
import {React, useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import Upload from './Upload';
import User from './UserPage';
import Auth from './components/Auth';
import Payment from './Payment';
import Cookies from 'js-cookie'; // or use document.cookie
import axios from 'axios';
import UserPage from './UserPage';
const App = () => {
  // fetch user session
  const [user, setUser] = useState('');

  useEffect(() => {
    const validateSession = async () => {
      const sessionCookie = Cookies.get('username');
      console.log(!sessionCookie === undefined || !sessionCookie == '' ? 'No session cookie found.' : `Session cookie: ${sessionCookie}`);
      setUser(sessionCookie);
  };
    validateSession();
  }, []);
  console.log('User:',user);
  return (
    <BrowserRouter>
      <Routes> 
            <Route path='/' element={<Home userId={user}/>} />
            <Route path='/Landing' element={<Landing userId={user}/>} />
            <Route path='/Upload' element={<Upload userId={user}/>} />
            <Route path='/User' element={<User userId={user}/>} />
            <Route path='/Auth' element={<Auth userId={user}/>} /> 
            <Route path='/Payment' element={<Payment userId={user}/>} />
            <Route path='/User' element={<User userId={user}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;