const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    required:[true, 'Please enter name of your product.'],
    type:String,
    minLength:3,
  },
  category: String,
  image: String,
  price: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now()     
  },
});

module.exports = mongoose.model("Product", productSchema);
