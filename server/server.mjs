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
import pkg from './GoogleOAuth.cjs';
import dotenv from 'dotenv/config'; // even tho its gray its needed
const MONGOURI = process.env.MONOGODB;
const { passport: googlePassport, app: googleApp } = pkg;
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

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


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
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
googlePassport.authenticate();
app.use(googleApp);
