const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  userId:Number,
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