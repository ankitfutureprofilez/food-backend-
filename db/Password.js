const mongoose = require("mongoose")

const passwordschema = mongoose.Schema({
  email: {
    type: String,
    required : true
  },
  otp:  {
    type: Number,
    required : true
  },
})

// userschema.virtual('banner_image').get(function() {
//   const APP_URL = 'https://food-backend-three.vercel.app';
//   return `${APP_URL}/storage/${this.image}`;
// });

// userschema.set('toObject', { virtuals: true });
// userschema.set('toJSON', { virtuals: true }); 


module.exports = mongoose.model("password",passwordschema)