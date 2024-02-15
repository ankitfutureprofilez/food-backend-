const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  firstName: {
    required:[true, 'Please enter your first name.'],
    type:String,
    minLength:3,
  },
  lastName: {
    required:[true, 'Please enter your last name.'],
    type:String,
    minLength:3,
  },
  email: {
    type: String,
    unique:[true, 'Username is already taken.'], 
  },
  userId:Number,
  resId:  {
    type: Number,
    default: null,
  },
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



// userschema.virtual('banner_image').get(function() {
//   const APP_URL = 'https://food-backend-three.vercel.app';
//   return `${APP_URL}/storage/${this.image}`;
// });

// userschema.set('toObject', { virtuals: true });
// userschema.set('toJSON', { virtuals: true }); 


module.exports = mongoose.model("user",userschema)