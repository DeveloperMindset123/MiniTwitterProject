const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const GOOGLE_CLIENT_ID = "1000681390710-omq8f36aua0r1ih93p455d960ush5uou.apps.googleusercontent.com"  //this is the client id, doesn't matter if it's exposed at the momemnt, what's important is that we get it work first as intended
const GOOGLE_CLIENT_SECRET = "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" //this should also be put into a .env file alter

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },

        function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done)=>{
    done(null,user);
});

passport.deserializeUser((user, done) =>{
    done(null, user);
})

/**
 * Logic of what's happening here:
 * Based on the code above, we have a function that gives us "accessToken", "refreshToken", "profile", "done" so that if the authentication is successfully done, it will return no error, only profile
 * 
 * Also, since we use sessions, we did serializeUser and deserializeUser to pass our sessions
 */

