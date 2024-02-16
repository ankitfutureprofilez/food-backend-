const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  userId: String,
});

module.exports = mongoose.model("Product", productSchema);