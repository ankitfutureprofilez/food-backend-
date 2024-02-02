const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    
  },
  userId:Number,
  password: String,
  confirmPassword: String,
  image: String,
})

module.exports = mongoose.model("user",userschema)