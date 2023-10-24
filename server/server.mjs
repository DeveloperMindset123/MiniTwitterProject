// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express from 'express';

const app = express();
const port = 4000;
const uri = "mongodb+srv://fahad:tI4nHN0PfaaeXq6R@deadbirdsociety.fgwkrhk.mongodb.net/?retryWrites=true&w=majority";

app.get('/api', (req, res) => {
  res.json({"users": ["user1", "user2", "user3"]}); // example response data
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function connectDB(){
  try{
    await mongoose.connect(uri);
    console.log("MongoDb Connected!");
  }
  catch(err){
    console.error(err)
  }
}
connectDB();