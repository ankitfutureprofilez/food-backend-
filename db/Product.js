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

productSchema.virtual('permalink').get(function() {
  const APP_URL =process.env.APP_URL || 'https://food-backend-three.vercel.app/';
  return `${APP_URL}/uploads/${this.image}`;
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true }); 

productSchema.index({ name: 'text' });
module.exports = mongoose.model("Product", productSchema);