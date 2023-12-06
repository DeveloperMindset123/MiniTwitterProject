import mongoose from 'mongoose';  //mongoose has already been installed and in use, meaning I don't need to reinstall it
import express, { json } from 'express';  //we initially planned on using JSOn but since we migrated everything to database, we will not be using JSON
import { SaveNewPost, UpdatePostCounter, FetchPosts, DeletePost, FetchTrending } from './posts.mjs';  //import the functions that has been written in posts.mjs, this handles the logic for posting, deleting, trending posts etc.
import { CreateUser, DeleteUser, GetUser, GetUserPosts, UpdateUser, GetUserByName } from './user.mjs';  //the functions defined here will allow us to manually create users, delete users, get user unformation etc.
import { askChatGPT } from './chatbot.mjs'; //this is where the chatgpt based code has been implemented
import fs from 'fs';
import cors from 'cors';  //imported by Ayan
import jwt from 'jsonwebtoken'; //imported by Ayan
//import { passport, app } from './passport.js';
//import { passport as googlePassport, app as googleApp, passport } from './GoogleOAuth.cjs';
import authRoute from './routes/auth.cjs';  //import the router function, import the auth.cjs functions
import cookieSession from 'cookie-session';
import expressSession from 'express-session';   //since express-session has already been imported, this means I have already installed it in the past
import bodyParser from 'body-parser';  //body-praser has already been installed, meaning we don't need to worry about bodyparser atm
import passport from 'passport';  //passport has already been imported and is in fact in use at the moment
import "./config/passport-local.cjs";
import helmet from 'helmet';
import passportLocalMongoose from 'passport-local-mongoose'; //import the passportLocalMongoose dependancy
import connectEnsureLogin from 'connect-ensure-login'; //import the connectEnsureLogin from the connect-ennsure-login module 
import { connect } from 'http2';
import User from './model/user-model.cjs';
//import './config/passport-setup.mjs';  //mjs equivalent of using require('./config/passport-setup.cjs')
//import dotenv from 'dotenv/config'; // even tho its gray its needed

import dotenv from 'dotenv/config'; // even tho its gray its in use
const MONGOURI = process.env.MONOGODB;

const app = express();  //initialize our express app
//configure express session
const expresSession = expressSession({
  secret: 'secret',  //here, we are configuring express-session with a secret to sign the session ID cookie (this can be changed to be a unique value instead, secret is the default value according to the tutorial)
  resave: false, //forces the session to be saved back to the session store
  saveUninitialized: false, //forces a session that is "uninitialized" to be saved to the store.
})


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
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,  //allow session cookies from browser to pass through
  })
)
app.use('/auth', authRoute);
app.use(helmet());
const port = 4000;
app.use(express.json());
app.use(bodyParser.json());  //this has already been defined, meaning we don't need to redefine it
//additional configurations for body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(expresSession);  //we want to ensure that our app is using the express session we defined above

app.listen(port, () => {  //in my case, the server is running on port 4000, on the tutorial, the server is running at port 5000
  console.log(`Server listening at http://localhost:${port}`);
});

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

    const requiredFields = [ 'bodyText'];

    if (!uniquePost || requiredFields.some(field => !uniquePost[field])) {
      res.status(400).json({ message: `Missing required fields:${requiredFields}` });
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
app.delete('/api/delete-post/:postId', async (req, res) => {//delete post based on post id
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
  const newUser = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  try {
    const requiredFields = ['userName']; // should expand this

    if (!newUser || requiredFields.some(field => !newUser[field])) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    console.log('New User: ' + newUser);
    const id = await CreateUser(newUser);

    res.status(201).json({ message: 'User created successfully!', id: id});
  } catch (err) {
    res.status(500).json({ message: 'Error saving new user:', err });
  }
});
//api for fetching user
app.get('/api/fetch-user', async (req, res) => {
  const userId = req.query.userId;
  console.log('userId:', userId);
  
  if(!userId || userId === ''){
    return res.status(400).json({ message: 'Missing userId', got: req.query });
  }
  try {
    const user = await GetUser(userId);
    console.log("Got User: ", userId);

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
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
    const response = await askChatGPT(String(req.body.input));

    res.status(201).json({ response });
  } catch (err) {
    res.status(500).json({ message: 'Error calling gpt:', err });
  }
});
// api for checking if user exists
app.get('/api/check-user', async(req, res) => {
  const userName = req.query.userName;
  const password = req.query.password;

  try{
    const user = await GetUserByName(userName);
    if(user.password === password){
      return res.status(200).json({message:'sign in successful', id: user._id});
    }
    else{
      return res.status(400).json({message:'Sign in Fail: either your password or username are incorrect!', id: user._id});
    }
  }catch(error){
    console.error('Error checking if user exists\n' + error);
    return res.status(500).json({message: 'server error ruh roh'});
  }
})
// Auth 
/**
 * Google Auth --> note: was running into some issues regarding authentication using the routes, which may have been causing confict, therefore, everything from auth.cjs was transferred here and instead we are using "app.get" method instead of "router.get" method
 * 
 * Another important meeting detail from fahad: if on the backend side the method defined is get, or post, on the frontend, we also have to use get or post, respectively, meaning the method needs to match
 * 
 * Note: use postman to verify api endpoints are successfully working as intended
 */
const CLIENT_URL = "http://localhost:5173/landing"; //on the tutorial, the client is running on local host 3000, in my case, the client is running on local host 5173
const CLIENT_HOME_URL = "http://localhost:5173/"

app.get("/auth/login/success", (req, res) => {  //api endpoint for successful login
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successful login",
            user: req.user,
            cookies: req.cookies,
        });
    }
});
app.get("/auth/login/failed", (req,res) => {  //api endpoint for failed login
    res.status(401).json({  //error message 401
        success: false,
        message: "login failed" //error message indicating that there has been a login failure
    })
});
app.get("/auth/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({'res':'Success!'}); //in my case, when the user logs out user will need to be redirected to the landing page, on the frontend side, the user is redirected back to the landing page, the res.redirect(CLIENT_URL) was causing an error
        // res.redirect(CLIENT_URL); //in my case, when the user logs out user will need to be redirected to the landing page
      });
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
app.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_HOME_URL, //upon successful login, redirect user to client home URL
        failureRedirect: "/login/failed"  //otherwise, direct the user back to the failed login
    })
);

/**End of google oauth code */

/**Beginning of Github authentication 
 * Advice: duplicates the api endpoints for google and simply cater it for github, the route endpoints needs to match what is defined in the callback url in passport-local.cjs file
*/
app.get("/auth/github", passport.authenticate("github", { scope: ["profie"]})); 
app.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_URL, //redirect user to the homepage after successful login
    failureRedirect: "/login/failed"  //Otherwise, direct the user back to the failed login screen
  })
)
//this is the end of the github authentication code

async function connectDB(){  //this is where the database connection the MongoDB database took place using mongoose
  try{
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