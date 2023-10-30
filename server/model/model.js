//create a model that will define our database structure
const mongoose = require('mongoose');


//this is a default template, we will adjust it later accordingly as needed
const dataSchema = new mongoose.Schema({
    name: {  //this just means that the name datatype will be of type string
        required: true,
        type: String,
    },
    age: {  //the age datatype will be of type Number
        required: true,
        type: Number,
    }
    //add additional attributes as needed
})

module.exports = mongoose.model('Data', dataSchema);