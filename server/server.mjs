// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express from 'express';

const app = express();
const port = 4000;

// Get Mongo URI
import fs from 'fs';
const filePath = 'mongoUri.json';
export function getUri(){
  try {
    const jsonContent = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(jsonContent);

    return config.uri;
  } catch (err) {
    console.error('Error reading or parsing the JSON file:', err);
  }
}


app.get('/api', (req, res) => {
  res.json({"users": ["user1", "user2", "user3"]}); // example response data
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function connectDB(){
  try{
    await mongoose.connect(getUri());
    console.log("MongoDb Connected!");
  }
  catch(err){
    console.error(err)
  }
}
connectDB();