const mongoose = require("mongoose");

const productschema = mongoose.Schema({
  id: String,
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  created_at: new Date.now()
});

module.exports = mongoose.model("payment_items", productschema);
