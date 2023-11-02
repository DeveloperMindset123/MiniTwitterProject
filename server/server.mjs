// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express, { json } from 'express';
import { SaveNewPost, UpdatePostCounter, FetchPosts } from './posts.mjs';
import { CreateUser, DeleteUser, GetUser, GetUserPosts, UpdateUser } from './user.mjs';
import fs from 'fs';

const app = express();
const port = 4000;
app.use(express.json());

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
// apis for USER POST related functions
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
// api for updating post-counter (likes, reports, etc.)
app.post('/api/update-post-counter/:postId/:type', async (req, res) => {
  const postId = req.params.postId;
  const type = req.params.type;

  try {
    await UpdatePostCounter(postId, type);

    res.status(200).json({ message: 'Post counter updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post counter:', err });
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
//api for deleting users
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


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function connectDB(){
  try{
    await mongoose.connect(mongoUri());
    console.log("MongoDb Connected!");
  }
  catch(err){
    console.log("Unable to connect to MongoDb");
    // process.exit();
    console.error(err);
  }
};
connectDB();