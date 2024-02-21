const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
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
