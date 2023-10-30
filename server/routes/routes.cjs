//here, we will be setting up API endpoints

//define the router file
const express = require('express');
const router = express.Router();  //call on the router  through express
module.exports = router;

//now, let's write our endpoints
//Post Method --> default, I commented out
/*
router.post('/post', (req, res) => {
    res.send('Post API')
})
*/
//Get all Method --> default, will update later
router.get('/getAll', (req, res) => {
    res.send('Get All API')
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    //res.send('Get by ID API')  --> thi si sjust a default template line
    res.send(req.params.id);  //this will return the id we are calling by, test it out on postman
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})
//import the model we deifned in our model.js file
const Model = require('../model/model.js');

//let's create a data body to post using the model we just created
router.post('/post', async (req, res) => {  //ensure that we are working with an async function, ensuring we always return something
    const data = new Model({
        name: req.body.name, //this will get the name attribute from the user and post it on our database
        age: req.body.age,  //this will get the age of the user, we get this data from the client app such as Postman or frontend framework like React
    })

    //create error processing: try and catch block to handle success messages and errors
    try {
        //in the try block, we are saving data using data.save(). Then, we are storing the data in a const called dataToSave. We are also sending the scucess message to the response body
        //And in the catch block we are recieving any errors in the case that we get any
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);  //save the resulting data in a json file, status message 200 indicates api call was successful
    } catch(error) {
        //if error occurs, return the error in json format
        res.status(400).json({message: error.message});  //post the message for the error
    }
})

//note: if we were to make the call http://localhost:4000/api/Post with the following body code:
/**
 * {
 *  "name": "Ayan Das",  --> since name is of type string
 * "age": 25
 * }
 */


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