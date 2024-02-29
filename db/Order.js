const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  order_id: {
    type: Number,
    default : 1
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  checkout_coordinates : {
    type: String,
    default : null
  },
  order_coordinates : {
    type: String,
    default : `{"lat": 26.9298469, "lng": 75.7853946}`
  },
  restaurent_coordinates : {
    type: String,
    default : `{"lat": 26.9298469, "lng": 75.7853946}`
  },
  order_items:String,
  order_status:{
    type: String,
    default :"initiated" // delivered || picked || initiated
  },
  phone_no:{
    type: String,
    default : null,
    maxLength: 10
  },
  payment_status:{
    type: String,
    default : 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now     
  },
  deliveredAt: {
    type: Date,
    default: null     
  },
});

module.exports = mongoose.model("payment_orders", orderSchema);
