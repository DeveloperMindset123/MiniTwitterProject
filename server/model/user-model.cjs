//create a user object model that represents the user profile in the database record
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //we are primarily listing out what the data type the compoennts within the object will be composed of
    googleId: {type: String, required: true, unique: true},  //the googleId needs to be unique, meaning no duplicates allowed
    screenName: {type: String},
    name: {type: String},
    email: {type: String},
    profileImage: {type: String},
    type: {type: String}
})

const User = mongoose.model("user", userSchema);

module.exports = User;