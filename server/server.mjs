// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express, { json } from 'express';
import { SaveNewPost, UpdatePostCounter, FetchPosts, DeletePost, FetchTrending } from './posts.mjs';
import { CreateUser, DeleteUser, GetUser, GetUserPosts, UpdateUser } from './user.mjs';
import { askChatGPT } from './chatbot.mjs';
import fs from 'fs';
import cors from 'cors';  //imported by Ayan
import jwt from 'jsonwebtoken'; //imported by Ayan
//import { passport, app } from './passport.js';
<<<<<<< HEAD
//import { passport as googlePassport, app as googleApp, passport } from './GoogleOAuth.cjs';
import authRoute from './routes/auth.cjs';  //import the router function, import the auth.cjs functions
import cookieSession from 'cookie-session';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import "./config/passport-local.cjs";
import helmet from 'helmet';
//import './config/passport-setup.mjs';  //mjs equivalent of using require('./config/passport-setup.cjs')

const app = express();
//ensure that the cookie session gets defined before evrything else
app.use(
  cookieSession({name: "session", keys: ["openreplay"], maxAge: 25 * 60 * 60 *100,})
)
//register regenerate & save the cookieSession middleware initialization, otherwise, authentication won't work successfully
app.use(function(request, response, next) {  //adding two conditional statements so as to not get error during redirect
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb()
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb()
    }
  }
  next()
})

app.use(passport.initialize());
app.use(passport.session());
//configure cors
app.use(
  cors({ 
    origin: 'http://localhost:5173',  //allows the server to accept requests from different origin
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true  //allow session cookies from browser to pass through
  })
)
app.use('/auth', authRoute);
app.use(helmet());
const port = 4000;
app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {  //in my case, the server is running on port 4000, on the tutorial, the server is running at port 4000
  console.log(`Server listening at http://localhost:${port}`);
});



//configure session storage
/* --> I don't think this is neccessary
app.use(cookieSession({
  name: 'session-name',
  keys: ['key1', 'key2']
})) */

// Get Mongo URI
export function mongoUri(){
  const filePath = 'mongoUri.json';
  try {
    const jsonContent = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(jsonContent);

    return config.uri;
  } catch (err) {
    console.error('Error reading or parsing the JSON file:', err);
  }
}
=======
import pkg from './GoogleOAuth.cjs';
import dotenv from 'dotenv/config'; // even tho its gray its needed
const MONGOURI = process.env.MONOGODB;
const { passport: googlePassport, app: googleApp } = pkg;
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());
>>>>>>> a47427f8afd8f853d3c2e5765fc7725178b3f167

//api for updating post-counter (likes, reports, etc.)
app.post('/api/update-post-counter/:postId/:type', async (req, res) => {
  const postId = req.params.postId;
  const type = req.params.type;
  res.header("Access-Control-Allow-Origin", "*");
  try {
    await UpdatePostCounter(postId, type);

    res.status(200).json({ message: 'Post counter updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post counter:', err });
  }
});
// api for saving a brand new post
app.post('/api/save-new-post', async (req, res) => {
  const uniquePost = req.body;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.header("Access-Control-Allow-Origin", "*");
  try {
    console.log('New Post: ' + uniquePost);
    const response = await SaveNewPost(uniquePost);
    
    //if too many curses
    if(response === false){
      res.status(403).json({message:"Too many banned words detected, you have been warned."});
      return;
    }

    const requiredFields = ['userId', 'bodyText', 'hashTags'];

    if (!uniquePost || requiredFields.some(field => !uniquePost[field])) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    res.status(201).json({ message: 'Post saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving new post:', err });
  }
});
// api for fetching all posts
app.get('/api/fetch-posts', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    // console.log('Getting new posts');
    const posts = await FetchPosts();

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error getting all posts', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
// api for deleting posts
app.delete('/api/delete-post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const result = await DeletePost(postId);

    if (result === false) {
        res.status(500).send('Internal Server Error');
    } else if (result === 'Post not found') {
        res.status(404).send('Post not found');
    } else {
        res.status(200).send('Post deleted successfully');
    }
});
app.get('/api/fetch-trendy', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const response = await FetchTrending();

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trendy posts:', err });
  }
});

// apis for USER related functions
// api for creating new user
app.post('/api/create-user', async (req, res) => {
  const newUser = req.body.newUser;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  try {
    console.log('New User: ' + newUser);
    await CreateUser(newUser);

    const requiredFields = ['userName']; // should expand this

    if (!newUser || requiredFields.some(field => !newUser[field])) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving new user:', err });
  }
});
//api for fetching user
app.get('/api/fetch-user', async (req, res) => {
  const userName = req.body.userName;
  try {
    const user = await GetUser(userName);
    console.log("Got User: ", user);

    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
//api for getting user's posts
app.get('/api/fetch-posts-user', async (req, res) => {
  const userName = req.body.userName;
  try {
    const posts = await GetUserPosts(userName);
    console.log("Got user's posts!");

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error getting user's posts", err);
    res.status(500).json({ error: "Failed to fetch user's posts" });
  }
});
//api for updating user
app.post('/api/update-user', async (req, res) => {
  const userName = req.body.userName;
  const newUser = req.body.changedUser;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  try {
    await UpdateUser(userName, newUser);

    res.status(201).json({ message: 'User updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving updated user:', err });
  }
});
//api for deleting users (takes in object userName)
app.post('/api/delete-user', async (req, res) => {
  const userName = req.body.userName;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  try {
    await DeleteUser(userName);

    res.status(201).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user:', err });
  }
});
// api for calling gpt (req must be a object 'question' with a string)
app.post('/api/askGPT', async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  try {
    const response = await askChatGPT(String(req.question));

    res.status(201).json({ response });
  } catch (err) {
    res.status(500).json({ message: 'Error calling gpt:', err });
  }
});


async function connectDB(){
  try{
    console.log(MONGOURI)
    await mongoose.connect(MONGOURI);
    console.log("MongoDb Connected!");
  }
  catch(err){
    console.log("Unable to connect to MongoDb");
    // process.exit();
    console.error(err);
  }
};
connectDB();
//app.use(googlePassport.session());
//googleApp();
