/*Some insights into the functionality being implemented
* Express: To set up the server on the backend. Here we will run the server on port 4000
* Cors: Supports cross-origin browser
* Cookie-session: Storing use session in cookies
* mongoose: for database connectivity
* passport and Passport-Google-OAuth20 = For google authentication using passport
*/



const passport = require('passport');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const session = require('express-session');


const UsersFilePath = './Data/Users.json';

const corsOptions = {
  origin: 'http://localhost:5173',
  optionSuccessStatus: 200,
};

function readUsersFromFile() {
  try {
    const usersData = fs.readFileSync(UsersFilePath, 'utf-8');
    return JSON.parse(usersData);
  } catch (err) {
    return [];
  }
}

function saveUsersToFile(users) {
  fs.writeFileSync(UsersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: '1000681390710-omq8f36aua0r1ih93p455d960ush5uou.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:4000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      const users = readUsersFromFile();
      const existingUser = users.find((user) => user.googleId == profile.id);

      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
        };

        users.push(newUser);
        saveUsersToFile(users);

        return cb(null, newUser);
      }
    }
  )
);

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
  

app.use(cors(corsOptions));
app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/Landing' }),
  function (req, res) {
    res.redirect('http://localhost:5173');
  }
);

module.exports = { passport, app };



