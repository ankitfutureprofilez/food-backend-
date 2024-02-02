const mongoose = require("mongoose");

const productschema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  //role:{type:"String", default:"Active"} ,
  // "discount":String
});

module.exports = mongoose.model("product", productschema);
