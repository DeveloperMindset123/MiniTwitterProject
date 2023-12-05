import mongoose from 'mongoose';  //mongoose has already been installed and in use, meaning I don't need to reinstall it
import express, { json } from 'express';  //we initially planned on using JSOn but since we migrated everything to database, we will not be using JSON
import { SaveNewPost, UpdatePostCounter, FetchPosts, DeletePost, FetchTrending } from './posts.mjs';  //import the functions that has been written in posts.mjs, this handles the logic for posting, deleting, trending posts etc.
import { CreateUser, DeleteUser, GetUser, GetUserPosts, UpdateUser } from './user.mjs';  //the functions defined here will allow us to manually create users, delete users, get user unformation etc.
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

/**
 * Breakdown of the steps involved:
 * 1. Serialization: When a user logs in, Passport serializes the user object (typically just the user ID) into the session. This is done using 'passport.serializeUser'
 * 2. Deserialization: On subsequent requests, Passport deserializes the user object from the session using `passport.deserializeUser`. The user object is then attached to the `req.user` property, allowing the application to identify the logged-in user.
 * 3. passport.session() --> middleware: This middleware is responsible for setting up passport to use sessions. It works in conjuction with the express session middleware, which must be used before `passport.session()` in the middleware stack.
 */


/**
 * Let is try to understand the logic that is taking place here, in order to understand it better:
 * 1. First, we require express and create our Express app by calling express(). Then we define the directory from which to serve our static files
 * 2. The next lines sees us require the body-parser middleware, which will help us parse the body of our requests. We're also adding the express-session middleware to help us save the session cookie
 */

app.listen(port, () => {  //in my case, the server is running on port 4000, on the tutorial, the server is running at port 5000
  console.log(`Server listening at http://localhost:${port}`);
});

//configure session storage
/* --> I don't think this is neccessary
app.use(cookieSession({
  name: 'session-name',
  keys: ['key1', 'key2']
})) */

//const MONGOURI = process.env.MONOGODB;
//const { passport: googlePassport, app: googleApp } = pkg;  --> we will not be using this
//const app = express();  --> this has already been declared once
//const port = 4000; --> this has already been declared once
//app.use(express.json()); --> this line has already been declared above as well


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
    await CreateUser(newUser);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving new user:', err });
  }
});
//api for fetching user
app.get('/api/fetch-user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await GetUser(userId);
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
    const response = await askChatGPT(String(req.body.input));

    res.status(201).json({ response });
  } catch (err) {
    res.status(500).json({ message: 'Error calling gpt:', err });
  }
});

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

/**Let's break down the logic that is taking place here:
 * 1. Here we require the previously installed packages. Then we connect to our database using mongoose.connect and give it the path to our database. Next, we're making use of a schema to define our data structure. In this case, we're creating a userDetail schema with username, password, corpo, trendy, normal/ordinary, etc, so that once the user signs up during the registration process, the information is saved
 */

/* --> we created a seperate schema model
const Schema = mongoose.Schema;
const userDetail = new Schema({
  _id: String,
  admin: Boolean,
  corporate: Boolean,
  trendy: Boolean,
  ordinary: Boolean, //note, I changed normal --> ordinary, to more accurately reflect the requirements of the project
  username: String,  //this will be the username the user registers with
  cash: Number,  //note that cash needs to be represented in not just whole numbers but also floating point values
  picture: Buffer, //in MongoDB, when storing images or binary data, the appropriate datatype for the "image" attribute is "Buffer". A Buffer is a built-in data type in MongoDb that can hold binary data. It is commonly used to store binary data such as images, documents or any other type of files
  bio: String,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],  //array of references: This is useful when it is neccessary to maintain a seperate collection for users and have a central place to store user details
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]  //same as above concept, added following and followers to distinguish who the user follows and whom is being followed by the user
}) 

userDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', userDetail, 'userInfo');
*/
/**Let's break donw what is going on here:
 * 1. After installing the passportLocalMongoose and importing it here, we make use of the schema to define our data structure. In this case, we're creating a schema named userData with various fields and datatypes
 * 2. next, we add passportLocalMongoose as a plugin to our schema. The first parameter is the name of the collection in the database. The second parameter references to our schema that was created, and the third one is the name we're assigning to the collection inside Mongoose
 * 
 */

/**Passport local authentication setup */
//passport.use(new LocalStrategy(UserDetails.authenticate()));

// --> uncomment this if the previous line causes errors, refer to the documentation --> passport.use(UserDetails.createStrategy()); //First, we make passport use the local strategy by calling the createStrategy() on our UserDetails model, utilizing passport-local-mongoose --> which takes care of everything so that we don't have to set up the strategy
//passport.serializeUser(UserDetails.serializeUser()); //Then, we're using serializeUser() and deserializeUser() callbacks. The first one will be invoked on authentication, and its job is to serialize the user instance with the inforemation we pass on to it and store it in the session via a cookie. The second one will be invoked every subsequent request to deserialize the instance, providing it the unique cookie identifier as a credential.
//passport.deserializeUser(UserDetails.deserializeUser());


//moved the code here
//here, we require passport and initialize it along with its session authentication middleware, directly inside our express app
//app.use(passport.initialize()); //--> let's understand what the purpose of this line is: Purpose --> This line initializes Passport and is typically used at the beginning of a middleware stack to set up the authentication process. Explanation: Passport initializes itself and prepares to authenticate requests. It adds properties and methods to the `req` (request) object, including the `req.passport` object.
//app.use(passport.session());  //--> purpose: This line sets up passport to support persistent login sessions. Explanations: Passport can maintain a user's login state across HTTP requests using sessions. When a user logs in, their user object is serialized and stored in the session, subsequent requests will deserialize the user object, making it available in `req.user`. This is particularly useful for keeping a user authenticated across multiple requests.


//the following are the list of links I left off at:
/**Define the routes associated with the server for the local authentication methods */
/*app.post('/login', (req, res, next) => { //create a route for user login
  passport.authenticate('local'),
  //if the authentication is successful, redirect to the homepage or send a success response
  res.status(200).json( {success: true, user: req.user })
});  //this will print out a success response on the console

//this needed additional modification
app.get('/login', passport.authenticate('local'), {
  successRedirect: '/',  //redirect the user to the homepage upon successfull login
  failureRedirect: '/login?info=Invalid Username or Password', //redirect user back to login page with an error message upon login failure
});
/**
 * Explanation for the below corresponding code:
 * 1. app.get('/') --> this is defining a route for the root URL ("/") of the web application
 * 2. 'app' is the instance of the express application
 * 3. 'connectEnsureLogin.ensureLoggedIn()' is a middleware function provided by the 'connect-ensure-login' library. It ensures that the user is logged in before allowing access to the subsequent middleware or route handler.
 * 4.  The third argument is a route handler function that gets executed when a request is made to the root URL. In this case, it sends the 'client/src/Home.jsx' file as a response. The {root: __dirname} option specifies that the file should be served from the current directory (this may also need to be modified)
 */
/*
app.get('/',   
  connectEnsureLogin.ensureLoggedIn(), (req, res) => res.sendFile('client/src/Home.jsx', {root: __dirname})
);

app.get('/private',  //this sets up a rorute for handling GET requests to the /private endpoint 
  connectEnsureLogin.ensureLoggedIn(),  //this serves as a route guard, it's job is validating the session to make sure you're allowed to look at that route
  (req, res) => res.sendFile('client/src/private.jsx', {root: __dirname})
);

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);

//define a registration route to handle information pertaining to registration
app.post('/register', async (req, res) => {
  try {
    //extract the user details from the request body (meaning get the data the user inserts in the input box)
    const { full_name, email_address, password, confirm_password, corporate } = req.body;

    //create a new user, note that the parameters inside userDetails needs to match the above user that has been created
    const user = await UserDetails.register(new UserDetails( {full_name, email_address, password, confirm_password, corporate }));

    //login the newly registered user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({success: false, message: 'Error loggin in after registration'}) //this will mean the user hasn't successfully registered
      }

      return res.status(201).json( {success: true, user});  //otherwise, if err message is false, that indicates that user has successfully logged in
    })
  } catch (err) {
    console.error('Error registering user:', err); //print out the error message in the case that user registration fails
    res.status(500).json( {message: 'Error registering user', error: err}); //this will specify the error message status and the message that will printed out on the console
  }
});



//next, we set up a route to handle a POST request to the '/login' path, inside the handler, we use the passport.authenticate method, which attempts to authenticate with the strategy it revieves as its first parameter --> in this case local. If authentication fails, it will redirect us to the '/login' page, but it will add a query parameter -- info -- that will contain an error message. Otherwise, if authentication is successful, it will redirect the user to the '/' route


/**
 * notes regarding connect-ensure-login:
 * 1. As the name suggest, this package is a middleware that ensures a user is logged in. If a request is recieved that is unauthenticated, the request will be redirected to a login page. We'll use this to guard our routes.
 */
app.post('/insert', async(req, res) => { //api endpoint code for getting information from user input
  const fullName = req.body.fullname
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const role = req.body.role

  const formData = new User({
    fullname: fullName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    role: role
  })
  console.log('recieved data!', formData);

  try { 
    await formData.save(); 
    res.status(200).json({formData});  //this is like a return statement, it can cause a continous loop
    console.log('registeration success!');
  } catch (err) {
    console.log(err)
    res.status(404).json({"error": "no data"});
  } 
});
connectDB();
//app.use(googlePassport.session());
//googleApp();
