const mongoose = require("mongoose");

const productschema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  userId:Number
});

productschema.index({ name:'text' });

module.exports = mongoose.model("product", productschema);
