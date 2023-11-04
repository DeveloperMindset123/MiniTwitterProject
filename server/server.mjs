// const express = require('express');
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import express, { json } from 'express';
import { SaveNewPost, UpdatePostCounter, FetchPosts } from './database.mjs';
import { CreateUser, DeleteUser, GetUser, GetUserPosts, UpdateUser } from './user.mjs';
import fs from 'fs';
import cors from 'cors';  //imported by Ayan
import { OAuth2Client } from 'google-auth-library'; //imported by Ayan
import jwt from 'jsonwebtoken'; //imported by Ayan


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
    await SaveNewPost(uniquePost);

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

//the following is the code for Google Authentication
//const session = require('express-session');
//const passport = require('passport');

//const GoogleStrategy = require('passport-google-oauth2');

import session from 'express-session';
import passport from 'passport';
import GoogleStrategy  from 'passport-google-oauth2';

//middleware
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())  //init passport on every route call
app.use(passport.session())  //allow passport to use "express-session"

//Get the GOOGLE _CLIENT_ID and GOOGLE_CLIENT_SECRET from google developer console, which I have already done
const GOOGLE_CLIENT_ID = "1000681390710-omq8f36aua0r1ih93p455d960ush5uou.apps.googleusercontent.com"  //this is my unique ID
const GOOGLE_CLIENT_SECRET = "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"  //this is my unique secret string

const authUser = (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}

//use "Google Strategy" as the Authentication strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:4000/auth/google/callback",
    passReqToCallback: true
}, authUser));

passport.serializeUser( (user, done) => {
    console.log(`\n-----> Serialize User:`)
    console.log(user);

    //The user object is the "authenticated user" from the done() in authUser function
    // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session
    done(null, user);
} )

passport.deserializeUser((user, done) => {
    console.log("\n-----Deserialized User:")
    console.log(user);

    //This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
    //deserializeUser will attach this {user} to the "req.user.{user}", so that it will be used anywhere in the App.
    
    done(null, user)
})

//no need to start the nodejs server since it's already running
//console.log() values of "req.session" and "req.user" so that we can see what is happening during Google Authentication
let count = 1;
const showlogs = (req, res, next) => {
  console.log("\n========================");
  console.log(`----------->$(count++)`)

  console.log(`\n req.session.passport ----------> `);
  console.log(req.session.passport);

  console.log(`\n req.user --------->`);
  console.log(req.user);

  console.log("\n Session and Cookie");
  console.log(`req.session.id ---------->${req.session.id}`);  //this will display the id of the user
  console.log(`req.session.cookie ---------> `);  
  console.log(req.session.cookie);  //this will display the cookie of the user

  console.log("=====================================\n");

  next();
}

app.use(showlogs);  //this will display all the 

app.get('/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: 'http://localhost:5173', //redirect the user to the home page if login using google is successful
    failureRedirect: 'http://localhost:5173/Landing',  //redirect the user back to the landing page if login isn't successful
  })
);

//define the login route
app.get("/login", (req, res) => {
  res.render("http://localhost:5173/Landing");  //this may need adjustment
});

//define the protected route, by using the "checkAuthenticated" function defined above as middleware
app.get("/dashboard", checkAuthenticated, (req, res) => {
  res.render("client/src/components/dashboard.ejs", {name: req.user.displayName});
})

//define the logout functionality
app.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("http://localhost:5173/Landing");
  console.log(`----------> User Logged out`);
})