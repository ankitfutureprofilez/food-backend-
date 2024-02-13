const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  userId: String
});

productSchema.virtual('permalink').get(function() {
  const APP_URL ="https://food-backend-three.vercel.app";
  return `${APP_URL}/image/${this.image}`;
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true }); 

productSchema.index({ name: 'text' });
module.exports = mongoose.model("Product", productSchema);