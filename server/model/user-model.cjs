//create a user object model that represents the user profile in the database record
const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const ReactFormDataSchema = new mongoose.Schema({
    //the schema needs to match the form
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false  //the user isn't required to select the corporate checkbox
    }
});

/*
const userSchema = new Schema({
    //we are primarily listing out what the data type the compoennts within the object will be composed of
    googleId: {type: String, required: true, unique: true},  //the googleId needs to be unique, meaning no duplicates allowed
    screenName: {type: String},
    name: {type: String},
    email: {type: String},
    profileImage: {type: String},
    type: {type: String}
})
*/
const User = mongoose.model("User", ReactFormDataSchema);

module.exports = User;