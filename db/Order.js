const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  order_id: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  checkout_coordinates : {
    type: String,
    default : null
  },
  order_coordinates : {
    type: String,
    default : null
  },
  distination_coordinates : {
    type: String,
    default : null
  },
  order_items:String,
  order_status:{
    type: String,
    default :"initiated" // delivered || picked || initiated
  },
  createdAt: {
    type: Date,
    default: Date.now()     
  },
  deliveredAt: {
    type: Date,
    default: null     
  },
});

module.exports = mongoose.model("payment_orders", orderSchema);
