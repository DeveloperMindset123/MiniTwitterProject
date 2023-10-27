// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express, { json } from 'express';
import { SaveNewPost, UpdatePostCounter } from './database.mjs';
const app = express();
const port = 4000;

// Get Mongo URI
import fs from 'fs';
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

app.get('/api', (req, res) => {
  res.json({"users": ["ur so skibbidi", "youre so fanum tax", "but im adin ross"]});
});
//api for updating post-counter (likes, reports, etc.)
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
// api for saving a brand new post
app.post('/api/save-new-post', async (req, res) => {
  const uniquePost = req.body;

  try {
    await SaveNewPost(uniquePost);

    res.status(201).json({ message: 'Post saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving new post:', err });
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