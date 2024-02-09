const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  firstName: {
    required:[true, 'Please enter your first name.'],
    type:String,
    minLength:3,
    maxLength:10
  },
  lastName: {
    required:[true, 'Please enter your last name.'],
    type:String,
    minLength:3,
    maxLength:10
  },
  email: {
    type: String,
    unique:[true, 'Username is already taken.'], 
  },
  userId:String,
  password: {
    type:String,
    select:false
  },
  confirmPassword: {
    type:String,
    select:false
  },
  image: String,
  role:  {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model("user",userschema)