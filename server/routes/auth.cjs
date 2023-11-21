const router = require("express").Router();  //define express router
const passport = require("passport");
const CLIENT_URL = "http://localhost:5173/Landing"; //on the tutorial, the client is running on local host 3000, in my case, the client is running on local host 5173
const CLIENT_HOME_URL = "http://localhost:5173/"

router.get("/login/success", (req, res) => {  //api endpoint for successful login
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successful login",
            user: req.user,
        });
    }
});

router.get("/login/failed", (req,res) => {  //api endpoint for failed login
    res.status(401).json({  //error message 401
        success: false,
        message: "login failed" //error message indicating that there has been a login failure
    })
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL); //redirect user back to client Landing page upon logging out
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_HOME_URL, //upon successful login, redirect user to client home URL
        failureRedirect: "/login/failed"  //otherwise, direct the user back to the failed login
    })
)

module.exports = router; //export the router function

//I will continue here: https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/


//some info regarding the router:
/**
 * This router is taking the route as the first parameter. Then in the second parameter, it's taking a callback. In the callbacks
 * Use POSTMAN to call on the API endpoints
 * Note: we are using http, not https
 * 
 * example call on postman, making a GET request: http://localhost:4000/getOne/1000 --> return status 200, will be okay
 * example call on postman, making a POST request: http://localhost:4000/post --> will return what is in the function body
 */

//the following link may be helpful: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function