const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    required:[true, 'Please enter name of your product.'],
    type:String,
    minLength:3,
  },
  category: String,
  image: String,
  price: {
    required:[true, 'Product price is invalid.'],
    type:String,
  },
  description: {
    required:[true, 'Description can not be empty.'],
    type:String,
  },
  userId: String
});

module.exports = mongoose.model("Product", productSchema);