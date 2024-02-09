const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
<<<<<<< HEAD
  userId:String
=======
  userId: String
>>>>>>> d6c7cb7c418f40d39039c07bb4a9caf4a8688fa3
});

productSchema.virtual('permalink').get(function() {
  const APP_URL = process.env.APP_URL || 'http://localhost:8000';
  return `${APP_URL}/storage/${this.image}`;
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true }); 

productSchema.index({ name: 'text' });
module.exports = mongoose.model("Product", productSchema);