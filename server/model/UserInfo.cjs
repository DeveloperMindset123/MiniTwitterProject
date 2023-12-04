/**
 * 
 * The following is the schema that is currently defined:
 * 
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

const mongoose = require('mongoose');
const UserInfoFormData = new mongoose.Schema({
    
})