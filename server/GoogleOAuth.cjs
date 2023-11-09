//import { profileEnd } from 'console';
//import { stringify } from 'querystring';

const profileEnd = require('console');
const stringify = require('querystring');

const passport = require('passport');
const fs = require('fs');
const cors = require('cors'); //this is needed for middleware

const UsersFilePath = './Data/Users.json'; //store the path potnting to the user file

const corsOptions = {
    origin: 'http://localhost:5173',  //Allow request from the frontend
    optionSuccessStatus: 200, 
}

//create a function to read the user data
function readUsersFromFile() {
    try {
        const usersData = fs.readFileSync(UsersFilePath, 'utf-8');
        return JSON.parse(usersData);
    } catch (err) {
        return []; 
    }
}

//create a function to save user data to the file
function saveUsersToFile(users) {
    fs.writeFileSync(UsersFilePath, JSON, stringify(users, null, 2), 'utf-8');
}



//the following code implement is based on passport decumentation
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const express = require('express');

passport.use(new GoogleStrategy ({
    clientID: '1000681390710-omq8f36aua0r1ih93p455d960ush5uou.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5173/auth/google/callback',
},
    function(accessToken, refreshToken, profile, cb) {

        //read user data from file
        const users = readUsersFromFile();

        //check if a user with the same googleId already exists
        const existingUser = users.find((user) => user.googleId == profile.id);

        if (existingUser) {
            //if the user already exists, return it
            return cb(null, existingUser);
        } else {
            //if the user doesn't exist, create a new user object
            const newUser = {
                googleId: profile.id, 
                name: profile.name,
                type: profile.usersData
                //add more user data as needed
            };

            //add the new user to the users array
            users.push(newUser);

            //save the updated users data to the file
            saveUsersToFile(users);

            //return the newly created user
            return cb(null, newUser);
        }
    }
));

app = express();

app.use(cors(corsOptions));  //to utilize the middleware function

app.get('/auth/google',  //defining the api endpoint for google
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/client/src/Landing.jsx'}),
    function(req, res) {
        //successful authentication, redirect home
        res.redirect('/client/src/Home.jsx');
    }
);


module.exports = {passport, app};


