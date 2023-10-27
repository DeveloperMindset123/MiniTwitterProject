//setting up a MongoDB server following a freecodecamp tutorial

/**Somethings to note:
 * 
 * Express will be used for the middleware to create various CRUD endpoints
 * Mongoose for managing data in MongoDB using various queries
 * Nodemon to restart our server every time we save our file
 * Dotenv to manage a .env file
 */

//let's add express and mongoose
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const routes = require('./routes/routes.cjs');  //import the routes.js file to the server side
require('dotenv').config();

const mongoString_ayan = process.env.DATABASE_URL  //call on the url stored in the .env file
const mongoString_fahad = process.env.DATABASE_URL2  //this is fahad's original code

//const uri = "mongodb+srv://<username>:<password>@cluster0.9j86fua.mongodb.net/?retryWrites=true&w=majority"; 
//now, transfer the contents of express into a new constant called app
const app = express();

//now let's listen to the changes of this file on port 4000
app.use(express.json());

app.listen(4000, () => {
    console.log(`Server stated at ${4000}`);
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/* --> this is the default template code for mongo db
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

//now, let's connect the databse to our server using Mongoose
mongoose.connect(mongoString_ayan);  //change this to fahad if needed
const database = mongoose.connection;

//now, we have to throw a success or error message depending on whether our database connection is successful or fails
database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database connected');
})

app.use('/api', routes);


